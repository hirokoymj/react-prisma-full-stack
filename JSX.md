# JSX Example

- Example 1

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
  );right

  return (
    <ColumnFlowLayout
      leftComponent={left}
      rightComponent={right}
      useBottomDrawer
    />
  );
};
```

- Example 2
  
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


