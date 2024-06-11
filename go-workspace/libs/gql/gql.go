package gql

import (
	"libs/gql/graph"
	"net/http"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

func Initialisation() (http.Handler, http.Handler) {
	graphqlInstance := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))
	playgroundHandler := playground.Handler("GraphQL playground", "/query")

	return graphqlInstance, playgroundHandler
}

// func main() {
// 	graphqlHandler, playgroundHandler := initialisation()

// 	http.Handle("/query", graphqlHandler)
// 	http.Handle("/", playgroundHandler)

// 	port := os.Getenv("PORT")
// 	if port == "" {
// 		port = "8080"
// 	}
// 	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
// 	log.Fatal(http.ListenAndServe(":"+port, nil))
// }




