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

[GraphQL ECOSYSTEM](https://www.prisma.io/docs/1.10/graphql-ecosystem/graphql-import/overview-quaidah9pn)

[GraphQL Bindings](https://github.com/prisma-labs/prisma-binding)

**schema.graphql**

```js
type Query {
    users(query: String, first: Int, skip: Int, after: String, orderBy: UserOrderByInput): [User!]!
    #users(where: UserWhereInput, first: Int, skip: Int, after: String, orderBy: UserOrderByInput): [User!]!
    user(where: UserWhereUniqueInput!): User		
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
    usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
}


type Mutation {
    createUser(data: CreateUserInput!): AuthPayload!
    deleteUser(id: ID!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    updatePost(id: ID!, data: UpdatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
    updateComment(id: ID!, data: UpdateCommentInput!): Comment!
}

type Subscription {
    comment(postId: ID!): CommentSubscriptionPayload!
    post: PostSubscriptionPayload!
}

type AggregateUser {
  users: [User!]!
  count: Int!
}


input CreateUserInput {
    name: String!
    email: String!
    password: String!
}

input UpdateUserInput {
    name: String
    email: String
    age: Int
}

input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
}

input UpdatePostInput {
    title: String
    body: String
    published: Boolean
}

input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
}

input UpdateCommentInput {
    text: String
}

type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    posts: [Post!]!
    createdAt: DateTime!
    updateAt: DateTime!
}

type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
}

type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
}

enum MutationType {
    CREATED
    UPDATED
    DELETED
}

type PostSubscriptionPayload {
    mutation: MutationType!
    data: Post!
}

type CommentSubscriptionPayload {
    mutation: MutationType!
    data: Comment!
}

```


## React Architecture
Abstruct, Commom, General

- `mapListingData` - mapping data from database
- `useListingTable` - Returns object with database data set for a page
- `ListingsCardView` - JSX
- `Listings` - Page Router, JSX, inside components


- Rentals - JSX TopLevel wrapper, 






```js
export const mapListingData = (data, defaultProtectionPlan) => {
  const cars = get(data, "viewer.me.owner.cars.edges", []);
  return map(cars, ({ node }) => {
    const combinedCarStatus = getCarStatus(node.status, node.verification);
    const photo = get(node, "photos[0].file.url", null);
    return {
      id: node.id,
      vin: node.vin,
      protectionPlan: node.defaultProtectionPlan
        ? capitalize(node.defaultProtectionPlan)
        : capitalize(defaultProtectionPlan),
      car: (
        <div style={{ display: "flex", alignItems: "center" }}>
          {photo ? (
            <Avatar
              alt="Driver"
              src={photo}
              style={{ width: "30px", height: "30px" }}
            />
          ) : (
            <Avatar style={{ width: "30px", height: "30px" }}>
              <ImageIcon />
            </Avatar>
          )}
          <span style={{ marginLeft: "16px" }}>
            {`${node.year} ${node.make} ${node.model}`}
          </span>
        </div>
      ),
      dailyPriceInDollars: `$${centsToDollars(node.dailyPriceInCents)}`,
      updatedAt: moment(node.updatedAt).format("MM/DD/Y"),
      status: CombinedCarStatusTextEnum[combinedCarStatus],
      yearMakeModel: `${node.year} ${node.make} ${node.model}`,
      carPhoto: <>{photo && <img alt="Driver" src={photo} />}</>,
    };
  });
};
```

```js
export const useListingsTable = options => {
  const { data, loading, error, fetchMore } = useQuery(FLEET_LISTINGS, options);

  const {
    data: defaultProtectionPlanData,
    loading: defaultProtectionPlanLoading
  } = useQuery(OWNER_DEFAULT_PROTECTION_PLAN, {
    fetchPolicy: "network-only"
  });
  const pageInfo = get(data, "viewer.me.owner.cars.pageInfo", {});
  const mappedData = mapListingData(
    data,
    get(defaultProtectionPlanData, "viewer.me.owner.defaultProtectionPlan", "")
  );
  const { fetchingMore, fetchMoreData } = useLoadMore(
    loading,
    error,
    fetchMore,
    pageInfo
  );

  return {
    data,
    mappedData,
    pageInfo,
    loading: loading || defaultProtectionPlanLoading,
    error,
    fetchingMore,
    fetchMoreData
  };
};
```

- Manual flow
- onSubmit define `ManualContainer` component
- onSubmit is always define TopLevel wrapper Component
- Manual Flow - `ManualContainer.js`
- Drawer - 


- `getCurrentComponent()` - ListingsDrawer

```js
export const Intro = () => {
  const classes = useStyles();
  const { nextStep, previousStep } = useContext(StepperFunctions);

  const left = (
    <FlowContentContainer
      header="Getting Started"
      nextStep={nextStep}
      nextStepLabel="Start"
      previousStep={previousStep}
      previousStepLabel="Exit"
    >
    </FlowContentContainer>
  );
  const right = (
    <TooltipContainer header="Helpful Tips" useIcon>
      <Tooltip
        header="Registration, Insurance, and Inspection"
        paragraphs={[
          "We will need proof of the..."
        ]}
      />
    </TooltipContainer>
  );

  return (
    <ColumnFlowLayout
      leftComponent={left}
      rightComponent={right}
      useBottomDrawer
    />
  );
};
```

```js
const getCurrentComponent = step => {
  switch (step) {
    case 0:
      return <Intro />;
    case 1:
      return <Location />;
    case 2:
      return <Info />;
    case 3:
      return <Protection />;
    case 4:
      return <Terms />;
    case 5:
      return <Images />;
    case 6:
      return <Documents />;
    default:
      return <Intro />;
  }
};

<DashboardLayout fixed hasAppBar>
  <FlowStepper steps={steps} header="Create a Listing" step={step} />
  {getCurrentComponent(step)}
</DashboardLayout>
```

### A Regular JS function vs React component function
### Rules of React Hook

https://reactjs.org/docs/hooks-rules.html

- https://reactjs.org/docs/hooks-state.html
- Can we define a function inside a functional component??

Don’t call Hooks from regular JavaScript functions. Instead, you can:

```js
useState() React hook 
```

### Pass props valuable to a component

- String
- Function
- Array object
- Object

**Example 1**
```js
<TabsWithRoutes
  paths={[
    {
      to: RouteEnum.listingsAll,
      label: "Listings"
    },
    {
      to: RouteEnum.listingsProgress,
      label: "In Progress"
    },
    {
      to: RouteEnum.listingsInventory,
      label: "Inventory",
      disabled: true
    }
  ]}
/>
```

**Example 2**
```js
<ListingsTable
  onRowClick={handleOnRowClick}
  tableName="All Listings"
  noDataLabel="You do not have any HyreCar Listings"
  initialColumns={[
    {
      field: "car",
      title: "Year, Make, Model",
      checked: true
    },
    {
      field: "vin",
      title: "VIN",
      checked: true
    },
  ]}
  initialWhere={{
    verification: CarVerificationEnum.verified
  }}
/>
```

**Example 3**
```js
<CarInfoFooter
  status={data["status"]}
  copyLink={generateCopyLink(data["carSummary"])}
  actionButtons={[
    {
      label: "view",
      to: `/fleet/dashboard/listings/all/${data["id"]}`
    }
  ]}
/>
```

#### Listings
- Fragment -> drawer routes -> Tabs -> DashboardLayout -> page routers
 
```js
<Fragment>
  <Route 
    path={[
      `${RouteEnum.listingsInventory}/:id`,
      `${RouteEnum.listingsProgress}/:id`,
      `${RouteEnum.listingsAll}/:id`
    ]}
    component={ListingDrawer} //<--- Drawer routes
  />
  <TabsWithRoutes //<--- Tab Routes
    paths={[
      {
        to: RouteEnum.listingsAll,
        label: "Listings"
      },
      {
        to: RouteEnum.listingsProgress,
        label: "In Progress"
      },
      {
        to: RouteEnum.listingsInventory,
        label: "Inventory",
        disabled: true
      }
    ]}
  />
  <DashboardLayout>
    <Switch>
      <Route path={RouteEnum.listingsAll} render={<ListingsTable />}/>
      <Route path={RouteEnum.listingsProgress} render={<ListingsTable />} />
    </Switch>
  </DashboardLayout>
</Fragment>	
```

#### DashboardSettings.js
- Fragment -> Tabs -> DashboardLayout -> page routers
 
```js
<Fragment>
  <TabsWithRoutes //<--- Tab Routes
    paths={[
      {
        to: RouteEnum.settingsProfile,
        label: "Profile"
      },
      {
        to: RouteEnum.settingsPayment,
        label: "ACH"
      },
    ]}
  />
  <DashboardLayout>
    <Switch>
      <Route
        exact
        path={RouteEnum.settingsProfile}
        component={UserProfile}
      />
      <Route
        exact
        path={RouteEnum.settingsPayment}
        component={SettingsACHController}
      />
    </Switch>
  </DashboardLayout>
</Fragment>	
```
<hr />





