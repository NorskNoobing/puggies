/*
 * Copyright 2022 Puggies Authors (see AUTHORS.txt)
 *
 * This file is part of Puggies.
 *
 * Puggies is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * Puggies is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public
 * License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Puggies. If not, see <https://www.gnu.org/licenses/>.
 */

package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	dataPath                         string
	demosPath                        string
	mapsPath                         string
	staticPath                       string
	frontendPath                     string
	port                             string
	incrementalRescanIntervalMinutes int
	trustedProxies                   []string
	debug                            bool
}

func getConfig() Config {
	// FOR DEVELOPERS: Make sure you update the configuration documentation when adding
	// a new variable here. Also update the String() method to print the variable
	return Config{
		dataPath:                         envOrString("PUGGIES_DATA_PATH", "/data"),
		demosPath:                        envOrString("PUGGIES_DEMOS_PATH", "/demos"),
		mapsPath:                         envOrString("PUGGIES_MAPS_PATH", "/backend/maps"),
		staticPath:                       envOrString("PUGGIES_STATIC_PATH", "/frontend/build"),
		frontendPath:                     envOrString("PUGGIES_FRONTEND_PATH", "/app"),
		port:                             envOrString("PUGGIES_HTTP_PORT", "9115"),
		incrementalRescanIntervalMinutes: envOrNumber("PUGGIES_DEMOS_RESCAN_INTERVAL_MINUTES", 180),
		trustedProxies:                   envStringList("PUGGIES_TRUSTED_PROXIES"),
		debug:                            envOrBool("PUGGIES_DEBUG", false),
	}
}

func (config Config) String() string {
	ret := "\n{\n"
	ret += "\t" + "dataPath: " + config.dataPath + "\n"
	ret += "\t" + "demosPath: " + config.demosPath + "\n"
	ret += "\t" + "mapsPath: " + config.mapsPath + "\n"
	ret += "\t" + "staticPath: " + config.staticPath + "\n"
	ret += "\t" + "frontendPath: " + config.frontendPath + "\n"
	ret += "\t" + "port: " + config.port + "\n"
	ret += "\t" + "incrementalRescanIntervalMinutes: " + strconv.Itoa(config.incrementalRescanIntervalMinutes) + "\n"
	ret += "\t" + "trustedProxies: " + strings.Join(config.trustedProxies, ", ") + "\n"
	ret += "\t" + "debug: " + strconv.FormatBool(config.debug) + "\n"
	ret += "}"
	return ret
}

func envOrString(key, defaultV string) string {
	val := os.Getenv(key)
	if val == "" {
		return defaultV
	}
	return val
}

func envOrBool(key string, defaultV bool) bool {
	val := strings.ToLower(os.Getenv(key))
	if val == "true" || val == "1" {
		return true
	}
	if val == "false" || val == "0" {
		return false
	}
	return defaultV
}

func envOrNumber(key string, defaultV int) int {
	val := os.Getenv(key)
	if val == "" {
		return defaultV
	}
	i, err := strconv.Atoi(val)
	if err != nil {
		fmt.Fprintf(os.Stderr, "[warn] invalid number \"%s\" provided for variable %s. Using default value of %d", val, key, defaultV)
		return defaultV
	}
	return i
}

func envStringList(envKey string) []string {
	val := os.Getenv(envKey)
	if val == "" {
		return nil
	}
	proxies := strings.Split(val, ",")
	return proxies
}
