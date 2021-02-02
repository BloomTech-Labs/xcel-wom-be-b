# API Endpoints

### Work Order Router:

**/company/{companyId}/order** or **/company/{companyId}/orders**

- `/company/{companyId}/orders`
  - GET: returns array of WOs for company (404 if none)
  - POST: add a new WO (returns msg & new WO)
- `/company/{companyId}/order/{orderId}`
  - GET: returns the specified WO
  - PUT: update the specified WO (returns msg & updated WO)
  - DELETE: remove the specified WO (returns msg & deleted WO)
- `/company/{companyId}/order/{orderId}/comments`
  - GET: returns array of comments for WO, empty array if none
  - POST: add comment (returns msg & new comment)
- `/company/{companyId}/order/{orderId}/comment/{commentId}`
  - PUT: update the comment (returns msg & updated comment)
  - DELETE: remove the comment (returns msg & deleted comment)
- `/company/{companyId}/order/{orderId}/images`
  - GET: returns array of images for WO, empty array if none
  - POST: add image (returns msg & new image)
- `/company/{companyId}/order/{orderId}/image/{imageId}`
  - DELETE: remove the image (returns msg & deleted image)

### User Router:

**/company**

- `/company/{companyId}`
  - GET: returns the company
- `/company/{companyId}/users`
  - GET: return array of users in company
  - POST: add a user (returns new user)
- `/company/{companyId}/user/{userId}`
  - GET: return specified user
  - PUT: update the user (returns msg & updated user)
  - DELETE: remove specified user (returns msg)
- `/company/user/{code}`
  - POST: creates a new user, putting them into the company and role specified by the code
- `/company/user/{userId}/{code}`
  - PUT: adds the user with the specified userId to the company and role associated with the code.
- `/company/new`
  - POST: expects `req.body` to contain both a user object and a company object. Creates the company, creates the user, adding the user as the 'Admin' of the new company. (I didn't know what path to put this on, so it can be changed if the team thinks of a better endpoint. Aside: we should review all the endpoints after the functionality is finalized and make sure they are useful labels.)

### Companies Router:

**/companies**

- `/companies`
  - GET: returns array of all companies
  - POST: add a company, set up roles & codes (returns msg & new company)
- `/companies/{companyId}`
  - GET: returns the specified company
  - PUT: update specified company (returns msg & updated company)
  - DELETE: remove the company (returns msg & deleted company)
- `/companies/{companyId}/roles`
  - GET: returns an array of the company's roles, including registration codes
- `/companies/roles/{code}`
  - GET: returns the role associated with the code

### Property Router:

**/property** or **/properties**

- `/properties`
  - GET: returns array of all properties
  - POST: add a property (returns msg & new property)
- `/property/{propertyId}`
  - GET: returns the specified property (404 if not found)
  - PUT: update a property (returns msg & updated property)
  - DELETE: remove the property (returns msg & deleted property)
