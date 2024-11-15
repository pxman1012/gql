import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// types
import { typeDefs } from './schema.js'

// db
import _db from "./_db.js";

const resolvers = {
    Query: {
        games() {
            return _db.games
        },
        game(_, args) {
            return _db.reviews.find((g) => g.id === args.id)
        },
        authors() {
            return _db.authors
        },
        author(_, args) {
            return _db.reviews.find((at) => at.id === args.id)
        },
        reviews() {
            return _db.reviews
        },
        review(_, args) {
            return _db.reviews.find((rv) => rv.id === args.id)
        }
    },
    Game: {
        reviews(parent) {
            return _db.reviews.filter(rv => rv.game_id === parent.id)
        }
    },
    Author: {
        reviews(parent) {
            return _db.reviews.filter(rv => rv.author_id === parent.id)
        }
    },
    Review: {
        game(parent) {
            return _db.games.filter(g => g.id === parent.game_id)
        },
        author(parent) {
            return _db.authors.filter(at => at.id === parent.author_id)
        }
    },
    Mutation: {
        deleteGame(_, args) {
            _db.games = _db.games.filter(g => g.id !== args.id)

            return _db.games
        },

        addGame(_, args) {
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString()
            }

            _db.games.push(game)
            return game
        },

        editGame(_, args) {
            // let game = _db.games.find(g => g.id === args.id)
            // game = { ...game, ...args.updateGame }

            // // _db.game
            // return game
            _db.games = _db.games.map(g => {
                // if (g.id === args.id) {
                //     const newG = { ...g, ...args.updateGame }
                //     return newG
                // }
                return (g.id === args.id) ? { ...g, ...args.updateGame } : g
            })

            return _db.games.find(g => g.id === args.id)
        }
    }

}

// server setup
const server = new ApolloServer({
    // typeDefs -- definitions of type of data game
    typeDefs,
    // resolvers
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log('Server ready at http://localhost:4000')
