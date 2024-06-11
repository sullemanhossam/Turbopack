package main

import (
	"fmt"
	dataaccess "libs/data-access"
	"libs/gql"
	"log"
	"net/http"
	"os"
)

func Hello(name string) string {
	result := "Hello " + name
	return result
}

func main() {
	graphqlHandler, playgroundHandler := gql.Initialisation()

	http.Handle("/query", graphqlHandler)
	http.Handle("/", playgroundHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
	fmt.Println(Hello(dataaccess.DataAccess("api")))
}
