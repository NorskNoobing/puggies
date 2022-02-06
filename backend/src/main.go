package main

import (
	"fmt"
	"os"
)

func main() {
	switch os.Args[1] {
	case "parse":
		if os.Args[2] != "" {
			ParseDemo(os.Args[2])
		} else {
			fmt.Fprintln(os.Stderr, "Provide the path to the demo file")
		}
	case "serve":
		dataPath := os.Getenv("PUGGIES_DATA_PATH")
		if dataPath == "" {
			dataPath = "/data"
		}

		frontendPath := os.Getenv("PUGGIES_FRONTEND_PATH")
		if frontendPath == "" {
			frontendPath = "/workspace/frontend/build"
		}

		RunServer(dataPath, frontendPath)
	}
}
