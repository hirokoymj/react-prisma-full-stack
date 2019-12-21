## Section 5

#### Before starting
- Start **pgAdmin4**
- Start GraphqlPlayground **localhost:4466**

#### 48. Add Post type to Prisma

- File: `datamodel.prisma`
- Add email in User type
- @unique
- Add posts field which is relation of Post type
- Add Post type
- deploy prisma using `prisma deploy` command.

<hr />

#### 49. Add Comment type to Prisma

- File: `datamodel.prisma`
- Add Comment type
- deploy prisma
  
51, 52, 53, 54, 55
prisma.query, prisma.mutation, prisma.exist 

11/27
## Section 6

#### 59. Adding Prisma into GraphQL Queries
    
**prisma.js**

```js
export { prisma as default }
```  

**index.js**

```js
import prisma from './prisma'
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
    },
    context: {
        db,
        pubsub,
        prisma //<----Added
    }
})
```

**Query.js**

```js
const Query = {
  users(parent, args, { prisma }, info) {
  return prisma.query.users(null, info)
  }
}
```

**GraphQL Playground**

```js
GraphQL for Node.js --> http://localhost:4000/
GraphQL for Prisma.js ---> http://localhost:4466/
```
<hr />


#### 60. Integrating Operation Arguments

- Example 1: Query.js
```js
const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {}
    console.log(args);

  if (args.query) {
      opArgs.where = {
        OR: [{
            name_contains: args.query
        }, {
            email_contains: args.query
        }]
      }
    }
    return prisma.query.users(opArgs, info)
  },  
}
```

**GraphQL Playground**

```js
query{
  users(query: "hiroko"){
    id
    name
    email
  }
}
```

- Example 2: Query.js
```js
const Query = {
  users(parent, args, { prisma }, info) {
    const options = Object.keys(args).reduce((acc, key) =>{
      if(key === 'query'){
        acc['where'] = {
          OR: [{
              name_contains: args['query']
          }, {
              email_contains: args['query']
          }]
        }
      }else{
        acc[key]
      }
      return acc;				
    }, {});
    return prisma.query.users(options, info)
  }
}

//The server is up!
//{"where":{"OR":[{"name_contains":"k"},{"email_contains":"k"}]}}
```


#### 61. Refactoring Custom Type Resolvers

**User.js**
```js
const User = {}
```

**Post.js**
```js
const Post = {}
```

**Comment.js**
```js
const Comment = {}
```

1.  Adding Prisma into GraphQL Mutations

**Mutation.js**
- createUser
- DeleteUser


#### 63-64. Adding Prisma into GraphQL Update Mutations: Part I and II

- createUser
- deleteUser
- updateUser
- createPost
- deletePost
- updatePost
- createComment
- updateComment
- deleteComment

#### 66. Closing Prisma to the Outside World

- to allow us to authenticate and validate request before actually reading and writing from the database.
- we can use the node server to check if someone has permission to read or write some data before the operation is actually performed.
- The problem is now client can directly communcate with Prisma (localhost:4466) so we are going to cut off the channel and force the client to pass all request through `Node`.
  

**prisma.yml**
- Add secret in prisma.yml
- deploy prisma `prisma deploy`
  
```js
endpoint: http://localhost:4466
datamodel: datamodel.prisma
secret: thisismysupersecrettext
```

**prisma.js**

```js
const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: "thisismysupersecrettext" // add same secret of prisma.yml
})
```

**Now we are going to be able to communicate with Prisma via Node.js**

localhost:4000 <---- Node.js 
localhost:4466 <--- Prisma

HTTP HEADER
```js
{
  "Authorization":"Bearer [TOKEN STRING HERE]
}
```

Generate TOKEN 
- Go to prisma directory.
- Execute `prisma token` command
<hr />

#### 67. Adding password field
1. Add password field in `prisma/datamodel.prisma`
2. Add password field in `schema.graphql`
3. When you change `datamodel.prisma` file, we need to run `get-schema` command. 

**graphql-cli Usage**
- [graphql-cli](https://www.prisma.io/docs/1.10/graphql-ecosystem/graphql-cli/overview-quaidah9pj)
- `graphql get-schema` - Download schema from **endpoint**.
- `graphql get-schema` command happens an error - "your token is invalid" because the only way you can access the schema is by endpoint. To fix this issue, edit `.graphqlconfig` file.

```js
{
  "projects": {
    "prisma": {
      "schemaPath": "src/generated/prisma.graphql",
      "extensions": {
      "prisma": "prisma/prisma.yml",//<--- Add this line to be able to run get-schema command without secret!!!
        "endpoints": {
          "default": "http://localhost:4466"
        }
      }
    }
  }
}
```

1. Run get-schema command again
```js
npm run get-schema

> graphql-basics@1.0.0 get-schema /Users/hirokoyamaji/LocalDocuments/Projects/udemy-section5/graphql-prisma
> graphql get-schema -p prisma

project prisma - Schema file was updated: src/generated/prisma.graphql
```
 
#### prisma deploy

[prisma deploy](https://www.prisma.io/docs/prisma-cli-and-configuration/cli-command-reference/prisma-deploy-xcv9/)
  >Every time you're changing a file from your service configuration, you need to synchronize these changes with the running Prisma service.

```js
cd prisma // Go to prisma directory
prisma deploy // Deploy prisma service.
```

<hr />

12/2
#### 68. Storing Passwords
Take in password -> Validate password -> Hash password -> Generate auth token

- A password must be 8 characters and longer.
- We do NOT store a plain text password in the database. We use a hashing password.
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
- [hash(s, salt, callback, progressCallback)](https://github.com/dcodeIO/bcrypt.js#hashs-salt-callback-progresscallback)
- `hash` returns promise.

```js
const password = await bcrypt.hash(args.data.password, 10)
```


### Pagination

12/2
#### 85. Working createAt and udpateAt

1. Add new fields in `prisma/datamodel.prisma`
2. Deploy prisma service `prisma deploy`
3. Add new fields in `schema.graphql` file and then generated a updated schema from endpoint using `npm run get-schema`.

**GQ Playground**

```js
mutation{
  createUser(data: {
    name: "hiroko"
    email: "hiroko@test.com"
    password: "hiroko12345"
  }){
    user{
      id
      name
      email
    }
    token
  }
}
```
<hr />

#### 83/84/85 Pagination (first, skip, after)

- schema.graphql
```js
type Query {
  users(query: String, first: Int, skip: Int, after: String, orderBy: UserOrderByInput): [User!]!
}
```

- Playground
```js
query{
  users(first: 2){
    id
    name
    email
  }
}
```

```js
query{
  users(first: 2 skip:3){
    id
    name
    email
  }
}
```

```js
query{
  users(first: 3 after: "ck3oqgoy606ld0794kasxvr1a"){
    id
    name
    email
  }
}
```
<hr />


#### 86. orderBy

**GQ Playground**

- [graphql-import](https://github.com/Urigo/graphql-import) - Import & export definitions in GraphQL SDL.
- `graphql-import` is included graphql-yoga server package.
  

**Usage**

1. Check enum values in `generated/prisma.graphql`

```js
enum UserOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}
enum PostOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  body_ASC
  body_DESC
  published_ASC
  published_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}
```

2. Import enum values in `schema.graphql` file.
  
**schema.graphql**
```js
# import UserOrderByInput, PostOrderByInput, CommentOrderByInput from './generated/prisma.graphql'

type Query {
  users(query: String, first: Int, skip: Int, after: String, orderBy: UserOrderByInput): [User!]!
  posts(query: String, first: Int, skip: Int, after: String, orderBy: PostOrderByInput): [Post!]!
}
```

**GQ playground**
localhost:4000
localhost:4466/

```js
query{
  users(orderBy: name_DESC){
    id
    name
    email
  }
}
```
<hr />

#### 56. Creating Prisma Second Project

1. Copy existing prisma folder and rename `prisma-review-website`.then delete docer-compose.yml
2. Delete `docker-compose.yml` file.
3. Modify datamodel.prisma
4. Added new endpoint in `prisma.yml`.

  ```js
  endpoint: http://localhost:4466/reviews/default //
  datamodel: datamodel.prisma
  secret: thisismysupersecrettext
  ```
5. Deploy prisma
   ```js
   >cd graphql-prisma/prisma-review-website/ //Go to prisma service directory.
   >prisma deploy //Execue prisma deploy command
   ```


12/3

**TODO**

- Prisma Production Deploy
- Section 6 remains `request`

**DONE**
- query: "" - where - DONE(12/5)
- orderBy DONE(12/5)
- How to find token string. DONE(12/5)
- Pagination(12/6)
- How to generate prisma service(12/9)
- Check Front-end for query with ID/fetch more
- ALL USER WITH ORDER BY
- SINGLE USER WITH ID

<hr />

### References:

- [GraphQL ECOSYSTEM](https://www.prisma.io/docs/1.10/graphql-ecosystem/graphql-import/overview-quaidah9pn)
- [GraphQL Bindings](https://github.com/prisma-labs/prisma-binding)

