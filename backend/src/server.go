package main

import "github.com/gin-gonic/gin"
import "net/http"

func ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}

func RunServer(dataPath, frontendPath string) {
	r := gin.Default()

	r.Static("/app", frontendPath)
	r.StaticFile("/favicon.ico", frontendPath+"/favicon.ico")

	r.NoRoute(func(c *gin.Context) {
		c.File(frontendPath + "/index.html")
	})
	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/app")
	})

	v1 := r.Group("/api/v1")
	{
		v1.GET("/ping", ping)
		v1.GET("/health", ping)
		v1.GET("/matches/:id", func(c *gin.Context) {
			fileName := c.Param("id")
			c.File(dataPath + "/" + fileName)
		})
		v1.StaticFile("/matchInfo.json", dataPath+"/matchInfo.json")
	}

	r.Run(":9115")
}
