package main

import (
	"net/http"
	"strings"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/go-co-op/gocron"
)

func doRescan(trigger string, config Config, logger *Logger) {
	logger.Infof("trigger=%s starting incremental demo folder rescan", trigger)
	err := parseAll(config.demosPath, config.dataPath, true, config, logger)
	if err != nil {
		logger.Errorf("trigger=%s failed to re-scan demos folder: %s", trigger, err.Error())
	} else {
		logger.Infof("trigger=%s incremental demo folder rescan finished", trigger)
	}
}

func registerJobs(s *gocron.Scheduler, config Config, logger *Logger) {
	logger.Info("registering scheduler jobs")
	s.Every(config.incrementalRescanIntervalMinutes).Minutes().Do(func() {
		doRescan("cron", config, logger)
	})
}

func runServer(config Config, logger *Logger) {
	r := gin.Default()

	if len(config.trustedProxies) != 0 {
		r.SetTrustedProxies(config.trustedProxies)
	} else {
		r.SetTrustedProxies(nil)
	}

	// Middlewares
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	// Frontend routes
	r.Static(config.frontendPath, config.staticPath)
	r.GET("/", redirToApp(config.frontendPath))

	// Static files in the root that browsers might ask for
	r.StaticFile("/android-chrome-192x192.png", join(config.staticPath, "android-chrome-192x192.png"))
	r.StaticFile("/android-chrome-512x512.png", join(config.staticPath, "android-chrome-512x512.png"))
	r.StaticFile("/apple-touch-icon.png", join(config.staticPath, "apple-touch-icon.png"))
	r.StaticFile("/favicon-16x16.png", join(config.staticPath, "favicon-16x16.png"))
	r.StaticFile("/favicon-32x32.png", join(config.staticPath, "favicon-32x32.png"))
	r.StaticFile("/favicon.ico", join(config.staticPath, "favicon.ico"))

	// Source code and license
	r.StaticFile("/puggies-src.tar.gz", join(config.staticPath, "puggies-src.tar.gz"))
	r.GET("/LICENSE.txt", license(config.staticPath))

	// API routes
	v1 := r.Group("/api/v1")
	{
		v1.GET("/ping", ping())
		v1.GET("/health", health())
		v1.GET("/matches/:id", matches(config.dataPath))
		v1.GET("/history.json", staticInRoot(config.dataPath, "history.json"))
		v1.GET("/usermeta.json", staticInRoot(config.dataPath, "usermeta.json"))

		v1.PATCH("/rescan", rescan(config, logger))
	}

	// 404 handler
	r.NoRoute(noRoute(config.staticPath, config.frontendPath))
	r.Run(":" + config.port)
}

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

func rescan(config Config, logger *Logger) func(*gin.Context) {
	return func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Incremental re-scan of demos folder started",
		})

		go doRescan("api", config, logger)
	}
}

func matches(dataPath string) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param("id")
		c.File(join(dataPath, "matches", id))
	}
}

func staticInRoot(dataPath, fileName string) func(*gin.Context) {
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
		// the frontend routing works properly
		if strings.HasPrefix(c.Request.URL.Path, frontendPath) {
			c.File(join(staticPath, "index.html"))
		} else {
			c.String(404, "404 not found\n")
		}
	}
}
