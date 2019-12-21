## React Page Architecture


#### PageLayout Componen

- Listings.js
- Defines routers
- Top Level JSX wrapper `<DashboardLayout />`
- Drawer Component - `ListingsDrawer`
- Table View Component - `ListingsTable`

```js
<Fragment>
  <Route 
    path={[ // <--- Drawer routes
      `${RouteEnum.listingsInventory}/:id`,
      `${RouteEnum.listingsProgress}/:id`,
      `${RouteEnum.listingsAll}/:id`
    ]}
    component={ListingDrawer} //<--- Drawer Component
  />
  <TabsWithRoutes //<--- Tab routes
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
      <Route path={RouteEnum.listingsAll} render={<ListingsTable />}/> /* Table component */
      <Route path={RouteEnum.listingsProgress} render={<ListingsTable />} />
    </Switch>
  </DashboardLayout>
</Fragment>	
```

#### ListingsTable(ListingsCardView) Component

- `useListingsTable` - Get data from dabase for a Table view.
- `useTableState` - Defines necessary states for a Table view.
  
```js
export const ListingsTable = ({
  initialColumns,
  initialWhere,
  filters,
  tableName,
  noDataLabel,
  noDataComponent,
  onRowClick
}) => {
  const {
    search,
    first,
    orderBy,
    page,
    selectedFilters,
    columns,
    handleSearchChange,
    handleFirstChange,
    nextPage,
    previousPage,
    handleSelectFilter,
    handleDeleteFilter
  } = useTableState({
    initialFirst: 10,
    initialOrderBy: "updatedAt_DESC",
    initialColumns
  });

  const { mappedData, pageInfo, loading } = useListingsTable({
    variables: {
      searchText: search,
      first,
      orderBy,
      skip: page * first,
      where: {
        ...initialWhere,
        ...selectedFilters.reduce((acc, val) => {
          if (Object.hasOwnProperty.call(acc, `${val.key}`)) {
            acc[val.key].push(val.value);
          } else {
            acc[val.key] = [val.value];
          }
          return acc;
        }, {})
      }
    },
    fetchPolicy: "network-only"
  });

  return (
    <Paper>
      <TableHead />
      <Table />
      <TableFooter />
    </Paper>
  );
};
```

#### Drawer Component

```js
export const ListingDrawer = () => {
  const [step, setStep] = useState(0);

  const sendToListingSummary = () => setStep(0);
  const sendToListingProtectionPlan = () => setStep(1);
  const sendToListingEdit = () => setStep(2);

  const getCurrentComponent = handleClose => {
    switch (step) {
      case 0:
        return <ListingSummary />;
      case 1:
        return <ListingProtectionPlan onClose={sendToListingSummary} />;
      case 2:
        return <ListingEdit sendToListingSummary={sendToListingSummary} />;
      default:
        return <ListingSummary handleClose={handleClose} />;
    }
  };

  return (
    <>
      <HideZendesk />
      <RouterDrawer>
        {({ handleClose }) => {
          return (
            <DrawerContainer>
              {getCurrentComponent(handleClose)}
            </DrawerContainer>
          );
        }}
      </RouterDrawer>
    </>
  );
};
```




