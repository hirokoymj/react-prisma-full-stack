# Pass props valuable to a component

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