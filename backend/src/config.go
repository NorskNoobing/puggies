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
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	assetsPath        string
	dataPath          string
	dbConnString      string
	dbType            string
	debug             bool
	demosPath         string
	frontendPath      string
	jwtSecret         []byte
	jwtSessionMinutes int
	migrationsPath    string
	port              string
	rescanInterval    int
	selfSignupEnabled bool
	staticPath        string
	timezone          string
	trustedProxies    []string
}

// FOR DEVELOPERS: Make sure you update the configuration documentation when adding
// a new variable here. Also update the String() method to print the variable
func getConfig() (Config, error) {
	dbType, err := envStringRequired("PUGGIES_DB_TYPE")
	if err != nil {
		return Config{}, err
	}

	if dbType != "postgres" {
		return Config{}, errors.New("Database type must be \"postgres\".")
	}

	dbConnString, err := envStringRequired("PUGGIES_DB_CONNECTION_STRING")
	if err != nil {
		return Config{}, err
	}

	jwtSecret, err := envStringRequired("PUGGIES_JWT_SECRET")
	if err != nil {
		return Config{}, err
	}

	rescanInterval, err := envOrNumber("PUGGIES_DEMOS_RESCAN_INTERVAL_MINUTES", 180)
	if err != nil {
		return Config{}, err
	}

	jwtSessionMinutes, err := envOrNumber("PUGGIES_JWT_SESSION_LENGTH_MINUTES", 4320)
	if err != nil {
		return Config{}, err
	}

	return Config{
		assetsPath:        envOrString("PUGGIES_ASSETS_PATH", "/backend/assets"),
		dataPath:          envOrString("PUGGIES_DATA_PATH", "/data"),
		dbConnString:      dbConnString,
		dbType:            dbType,
		debug:             envOrBool("PUGGIES_DEBUG", false),
		demosPath:         envOrString("PUGGIES_DEMOS_PATH", "/demos"),
		frontendPath:      envOrString("PUGGIES_FRONTEND_PATH", "/app"),
		jwtSecret:         []byte(jwtSecret),
		jwtSessionMinutes: jwtSessionMinutes,
		migrationsPath:    envOrString("PUGGIES_MIGRATIONS_PATH", "/backend/migrations"),
		port:              envOrString("PUGGIES_HTTP_PORT", "9115"),
		rescanInterval:    rescanInterval,
		selfSignupEnabled: envOrBool("PUGGIES_ALLOW_SELF_SIGNUP", false),
		staticPath:        envOrString("PUGGIES_STATIC_PATH", "/frontend/build"),
		timezone:          envOrString("PUGGIES_TZ", "Etc/UTC"),
		trustedProxies:    envStringList("PUGGIES_TRUSTED_PROXIES"),
	}, nil
}

func (config Config) String() string {
	ret := "\n{\n"
	ret += "\t" + "assetsPath: " + config.assetsPath + "\n"
	ret += "\t" + "dataPath: " + config.dataPath + "\n"
	ret += "\t" + "dbConnString: [redacted]\n"
	ret += "\t" + "dbType: " + config.dbType + "\n"
	ret += "\t" + "debug: " + strconv.FormatBool(config.debug) + "\n"
	ret += "\t" + "demosPath: " + config.demosPath + "\n"
	ret += "\t" + "frontendPath: " + config.frontendPath + "\n"
	ret += "\t" + "jwtSecret: [redacted]\n"
	ret += "\t" + "jwtSessionMinutes: " + strconv.Itoa(config.jwtSessionMinutes) + "\n"
	ret += "\t" + "migrationsPath: " + config.migrationsPath + "\n"
	ret += "\t" + "port: " + config.port + "\n"
	ret += "\t" + "rescanInterval: " + strconv.Itoa(config.rescanInterval) + "\n"
	ret += "\t" + "selfSignupEnabled: " + strconv.FormatBool(config.selfSignupEnabled) + "\n"
	ret += "\t" + "staticPath: " + config.staticPath + "\n"
	ret += "\t" + "timezone: " + config.timezone + "\n"
	ret += "\t" + "trustedProxies: " + strings.Join(config.trustedProxies, ", ") + "\n"
	ret += "}"
	return ret
}

func envStringRequired(key string) (string, error) {
	val := os.Getenv(key)
	if val == "" {
		return "", errors.New("missing required environment variable " + key)
	}
	return val, nil
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

func envOrNumber(key string, defaultV int) (int, error) {
	val := os.Getenv(key)
	if val == "" {
		return defaultV, nil
	}
	i, err := strconv.Atoi(val)
	if err != nil {
		return defaultV, errors.New(
			fmt.Sprintf("[warn] invalid number \"%s\" provided for variable %s. Using default value of %d", val, key, defaultV),
		)
	}
	return i, nil
}

func envStringList(envKey string) []string {
	val := os.Getenv(envKey)
	if val == "" {
		return nil
	}
	proxies := strings.Split(val, ",")
	return proxies
}
