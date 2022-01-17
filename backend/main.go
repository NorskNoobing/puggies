package main

import (
	"encoding/json"
	"fmt"
	"math"
	"os"

	dem "github.com/markus-wa/demoinfocs-golang/v2/pkg/demoinfocs"
	demcommon "github.com/markus-wa/demoinfocs-golang/v2/pkg/demoinfocs/common"
	events "github.com/markus-wa/demoinfocs-golang/v2/pkg/demoinfocs/events"
)

func mapValTotal(m *map[string]int) int {
	sum := 0
	for _, val := range *m {
		sum += val
	}
	return sum
}

func arrayMapTotal(a *[]map[string]int) map[string]int {
	ret := make(map[string]int)
	for _, m := range *a {
		for k, v := range m {
			ret[k] += v
		}
	}
	return ret
}

type Output struct {
	TotalRounds int                `json:"totalRounds"`
	Teams       map[string]string  `json:"teams"`
	Kills       map[string]int     `json:"kills"`
	Assists     map[string]int     `json:"assists"`
	Deaths      map[string]int     `json:"deaths"`
	HeadshotPct map[string]float64 `json:"headshotPct"`
	Kd          map[string]float64 `json:"kd"`
	Kdiff       map[string]int     `json:"kdiff"`
	Kpr         map[string]float64 `json:"kpr"`
	Adr         map[string]float64 `json:"adr"`
	Kast        map[string]float64 `json:"kast"`
	Impact      map[string]float64 `json:"impact"`
	Hltv        map[string]float64 `json:"hltv"`
}

func main() {
	f, err := os.Open("/home/jayden/Downloads/1-349fcf3c-681b-47e6-a134-47c8e27a25d9-1-1.dem")
	// f, err := os.Open("/home/jayden/Downloads/pug_de_nuke_2022-01-16_05.dem")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	p := dem.NewParser(f)
	defer p.Close()

	var kills []map[string]int
	var deaths []map[string]int
	var assists []map[string]int
	var headshots []map[string]int
	var damage []map[string]int

	var teams map[string]string

	// Register handler on kill events
	p.RegisterEventHandler(func(e events.Kill) {
		// In faceit these events can sometimes trigger before we
		// even have a RoundStart event so the stats arrays will be
		// empty
		if len(kills) == 0 {
			return
		}

		var assister string
		if e.Assister != nil {
			assister = fmt.Sprintf(" (+%s)", e.Assister.Name)
		}

		if e.Assister != nil {
			assists[len(assists)-1][e.Assister.Name] += 1
		}

		if e.Killer != nil {
			kills[len(kills)-1][e.Killer.Name] += 1

			if e.IsHeadshot {
				headshots[len(headshots)-1][e.Killer.Name] += 1
			}
		}

		if e.Victim != nil {
			deaths[len(deaths)-1][e.Victim.Name] += 1
		}

		if e.Killer != nil && e.Killer.Name == "" {
			fmt.Printf("%s <%v%s> %s\n", e.Killer, e.Weapon, assister, e.Victim)
		}
	})

	// p.RegisterEventHandler(func(e events.RoundEnd) {
	// 	fmt.Printf("%d %d - %d %d\n", e.WinnerState.ID(), e.WinnerState.Score() + 1, e.LoserState.Score(), e.LoserState.ID())
	// })

	p.RegisterEventHandler(func(e events.PlayerHurt) {
		// In faceit these events can sometimes trigger before we
		// even have a RoundStart event so the damage array will be
		// empty
		if len(damage) == 0 {
			return
		}

		if e.Attacker != nil && e.Player != nil {
			damage[len(damage)-1][e.Attacker.Name] += e.HealthDamageTaken
		}
	})

	p.RegisterEventHandler(func(e events.PlayerTeamChange) {
		if teams == nil || e.IsBot {
			return
		}

		switch e.NewTeam {
		case demcommon.TeamCounterTerrorists:
			teams[e.Player.Name] = "CT"
		case demcommon.TeamTerrorists:
			teams[e.Player.Name] = "T"
		}

	})

	p.RegisterEventHandler(func(e events.TeamSideSwitch) {
		teams = make(map[string]string)
	})

	// Create a new 'round' map in each of the stats arrays
	p.RegisterEventHandler(func(e events.RoundStart) {
		kills = append(kills, make(map[string]int))
		deaths = append(deaths, make(map[string]int))
		assists = append(assists, make(map[string]int))
		headshots = append(headshots, make(map[string]int))
		damage = append(damage, make(map[string]int))
	})

	fmt.Println("Parsing demo...")
	err = p.ParseToEnd()
	if err != nil {
		panic(err)
	}

	// Figure out where the game actually goes live
	startRound := 0
	for i := len(kills) - 2; i > 0; i-- {
		killsNext := mapValTotal(&kills[i+1])
		killsCurr := mapValTotal(&kills[i])
		killsPrev := mapValTotal(&kills[i-1])

		// Three consecutive rounds with no kills will be
		// considered the start of the game (faceit + pugsetup
		// have the triple-restart and then MATCH IS LIVE thing)
		if killsPrev+killsCurr+killsNext == 0 {
			startRound = i + 1
		}
	}

	kills = kills[startRound+1:]
	deaths = deaths[startRound+1:]
	assists = assists[startRound+1:]
	headshots = headshots[startRound+1:]
	damage = damage[startRound+1:]

	totalRounds := len(kills)

	totalKills := arrayMapTotal(&kills)
	totalDeaths := arrayMapTotal(&deaths)
	totalAssists := arrayMapTotal(&assists)
	totalHeadshots := arrayMapTotal(&headshots)
	totalDamage := arrayMapTotal(&damage)

	kast := make(map[string]float64)
	for i := 0; i < totalRounds; i++ {
		for p := range teams {
			// KAS -- we won't do T (trades) for now because that's too complicated
			if kills[i][p] != 0 || assists[i][p] != 0 || deaths[i][p] == 0 {
				kast[p] += 1 / float64(totalRounds)
			}
		}
	}

	for k, v := range kast {
		kast[k] = math.Round(v * 100)
	}

	// Initialze these maps with all players from kills + deaths
	// in case anyone got 0 kills or 0 deaths (lol)
	kd := make(map[string]float64)
	kdiff := make(map[string]int)
	kpr := make(map[string]float64)
	headshotPct := make(map[string]float64)
	adr := make(map[string]float64)

	for p := range totalKills {
		kd[p] = 0
		kdiff[p] = 0
		kpr[p] = 0
		headshotPct[p] = 0
	}

	for p := range totalDeaths {
		kd[p] = 0
		kdiff[p] = 0
		kpr[p] = 0
		headshotPct[p] = 0
	}

	// Compute headshot percentages, K/D & K-D etc
	for player, numKills := range totalKills {
		numHeadshots := totalHeadshots[player]
		numDeaths := totalDeaths[player]

		if numHeadshots == 0 || numKills == 0 {
			headshotPct[player] = 0
		} else {
			headshotPct[player] = math.Round((float64(numHeadshots) / float64(numKills)) * 100)
		}

		if numDeaths == 0 {
			kd[player] = math.Inf(1)
		} else {
			kd[player] = math.Round((float64(numKills)/float64(numDeaths))*100) / 100
		}

		kdiff[player] = numKills - numDeaths
		kpr[player] = math.Round((float64(numKills)/float64(totalRounds))*100) / 100
	}

	for player, damage := range totalDamage {
		adr[player] = math.Round((float64(damage) / float64(totalRounds)))
	}

	impact := make(map[string]float64)
	for p := range teams {
		assistsPerRound := (float64(totalAssists[p]) / float64(totalRounds))

		// https://flashed.gg/posts/reverse-engineering-hltv-rating/
		impact[p] = math.Round((2.13*kpr[p]+0.42*assistsPerRound-0.41)*100) / 100
	}

	hltv := make(map[string]float64)
	for p := range teams {
		dpr := float64(totalDeaths[p]) / float64(totalRounds)

		// https://flashed.gg/posts/reverse-engineering-hltv-rating/
		hltv[p] = math.Round((0.0073*kast[p]+0.3591*kpr[p]+-0.5329*dpr+0.2372*impact[p]+0.0032*adr[p]+0.1587)*100) / 100
	}

	jsonstring, _ := json.MarshalIndent(&Output{
		TotalRounds: totalRounds,
		Teams:       teams,
		Kills:       totalKills,
		Assists:     totalAssists,
		Deaths:      totalDeaths,
		HeadshotPct: headshotPct,
		Kd:          kd,
		Kdiff:       kdiff,
		Kpr:         kpr,
		Adr:         adr,
		Kast:        kast,
		Impact:      impact,
		Hltv:        hltv,
	}, "", "  ")

	fmt.Println(string(jsonstring))
}
