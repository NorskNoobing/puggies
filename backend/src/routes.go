package main

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func ping() func(*gin.Context) {
	return func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	}
}

// may update this later with actual health information
func health() func(*gin.Context) {
	return func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "healthy",
		})
	}
}

func rescan(c Context) func(*gin.Context) {
	return func(ginc *gin.Context) {
		ginc.JSON(200, gin.H{
			"message": "Incremental re-scan of demos folder started",
		})

		go doRescan("api", c)
	}
}

func match(c Context) func(*gin.Context) {
	return func(ginc *gin.Context) {
		id := ginc.Param("id")
		if strings.Contains("..", id) {
			ginc.String(400, "bruh\n")
		}

		meta, match, err := c.db.GetMatch(id)
		if err != nil {
			errString := fmt.Sprintf("Failed to fetch matches: %s", err.Error())
			c.logger.Errorf(errString)
			ginc.JSON(500, gin.H{
				"message": errString,
			})
		} else {
			ginc.JSON(200, gin.H{
				"meta":      meta,
				"matchData": match,
			})
		}
	}
}

func history(c Context) func(*gin.Context) {
	return func(ginc *gin.Context) {
		matches, err := c.db.GetMatches()
		if err != nil {
			errString := fmt.Sprintf("Failed to fetch matches: %s", err.Error())
			c.logger.Errorf(errString)
			ginc.JSON(500, gin.H{
				"message": errString,
			})
			return
		} else {
			ginc.JSON(200, matches)
			return
		}
	}
}

func file(dataPath, fileName string) func(*gin.Context) {
	return func(c *gin.Context) {
		c.File(join(dataPath, fileName))
	}
}

func license(frontendPath string) func(*gin.Context) {
	return func(c *gin.Context) {
		c.File(join(frontendPath, "LICENSE.txt"))
	}
}

func redirToApp(frontendPath string) func(*gin.Context) {
	return func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, frontendPath)
	}
}

func noRoute(staticPath, frontendPath string) func(*gin.Context) {
	return func(c *gin.Context) {
		// Serve the frontend in the event of a 404 at /app so that
		// the frontend routing works properly when navigating directly
		// to a page like /match/my_match_id
		path := c.Request.URL.Path
		if strings.HasPrefix(path, frontendPath) && !isLikelyFile(path) {
			c.File(join(staticPath, "index.html"))
		} else {
			c.String(404, "404 not found\n")
		}
	}
}
