# Redux Form 

### React Hooks with a Function as Child Component vs HOC

- UserProfileForm

```js
const UserProfileForm = reduxForm({
  form: "EDIT_USER_PROFILE"
})(({ handleSubmit, submitting }) => {
  const classes = useStyles();

  return (
    <>
      <Grid container>
        <ProfileAccountInfoFields />
      </Grid>
      <Grid container>
        <ProfileLocationFields />
      </Grid>
      <Grid
        item
        container
        xs={12}
        justify="flex-end"
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Saving" : "Save"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
});
```

- UserProfileFormController
  
```js
export const UserProfileFormController = ({ children }) => {
  const { data } = useQuery(CURRENT_USER_QUERY);
  const [updateOwnerProfile] = useMutation(UPDATE_OWNER_PROFILE);

  const initialValues = {
    firstName: get(data, "viewer.me.firstName", null),
    lastName: get(data, "viewer.me.lastName", null),
  };

  const onSubmit = async values => {
    try {
      await updateOwnerProfile({
        variables: {
          ...values,
          phone: values.phone.replace(/[^0-9]/g, "")
        }
      });
      enqueueSnackbar("User profile successfully updated!", {
        variant: "success"
      });
    } catch (e) {
      console.error(e);
    }
  };

  const validate = values => {
    let errors = {};
     return errors;
  };

  return children({
    onSubmit,
    validate,
    initialValues
  });
};
```

- UserProfile
```js
export const UserProfile = () => {
  return (
      <UserProfileFormController>
        {props => <UserProfileForm {...props} />} 
      </UserProfileFormController>
  );
};
```
<hr />

### Redux Form (HOC)

- UserProfileFields
 
```js
export const UserProfileFields = ({
  handleSubmit,
  mutating,
}) => {
  return (
    <Fragment>
      <Field
        name="firstName"
        label="First Name"
        placeholder="First Name"
        component={BasicInputText}
      />
      <Button onClick={handleSubmit} disabled={mutating}>
        {mutating ? "Saving..." : "Save"}
      </Button>
    </Fragment>
  );
};
```

- UserProfileForm
```js
const UserProfileForm = reduxForm({
  form: "EDIT_USER_PROFILE"
})(({ opened, open, close, handleSubmit, mutating, hasProfilePhoto }) => {
  return (
    <div className="user-profile-form">
      {!opened ? (
        <Button onClick={open}>Edit Profile</Button>
      ) : (
        <UserProfileFields
          handleSubmit={handleSubmit}
          close={close}
          mutating={mutating}
          hasProfilePhoto={hasProfilePhoto}
        />
      )}
    </div>
  );
});
```

- UserProfile
```js
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const {
      mutate,
    } = this.props;
    mutate({
      variables: {
        ...values,
        phone: values.phone ? values.phone.replace(strip, "") : null
      }
    }).then(() => {
      toastManager.add("User profile successfully updated!");
      this.props.data.refetch();
    });
  }

  render() {
    const { loading, data, mutating, currentUser } = this.props;
    const user = optionalChaining(() => data.viewer.me);
    return loading ? (
      <div>Loading...</div>
    ) : (
      <div>
        <Grid fluid>
          <Row>
            <Col md={6}>
              <UserProfileForm
                onSubmit={this.handleSubmit}
                mutating={mutating}
                initialValues={{
                  firstName: user.firstName,
                  lastName: user.lastName,
                  phone: formatPhone(user.phone),
                  zip: optionalChaining(() => user.location.zip),
                  address: optionalChaining(
                    () => user.location.formattedAddress
                  ),
                  photo: optionalChaining(() => user.profilePhoto)
                }}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
```

- UserProfileController
```js
export const UserProfileController = compose(
  currentUserQuery(),
  updateOwnerProfile(),
  withToastManager
)(UserProfile);
```