module.exports = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Xcel Work Order Management',
      version: '0.1.0',
      description:
        'A tool to help property managers log and track work orders in their buildings.',
      license: {
        name: 'MIT',
        url: 'https://en.wikipedia.org/wiki/MIT_License',
      },
    },
    tags: [
      {
        name: 'status',
        description: 'Check if the server is up',
      },
      {
        name: 'workOrder',
        description: 'Operations for Work Orders',
      },
      {
        name: 'user',
        description: 'Operations for working with Users',
      },
      {
        name: 'company',
        description: 'Operations associated with the company',
      },
      {
        name: 'role',
        description: 'Checking roles and adding users to them',
      },
      {
        name: 'property',
        description: 'Adding and updating properties/buildings',
      },
      {
        name: 'comment',
        description: 'Operations for comments on Work Orders',
      },
      {
        name: 'image',
        description: 'Operations for images on Work Orders',
      },
    ],
    components: {
      securitySchemes: {
        okta: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Okta idToken JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
        BadRequest: {
          description: 'Bad request. profile already exists',
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'A message about the result',
                    example: 'Not Found',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./api/**/*Router.js'],
};
