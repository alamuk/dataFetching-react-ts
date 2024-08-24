# Data fetching:
1. library: TanStack Query
2. https://tanstack.com/query/latest/docs/framework/react/typescript
3. create helper function in a Util folder. 
4. Zod library can be used to validate fetching data: https://zod.dev/
5. used -Dummy API request. ( https://jsonplaceholder.typicode.com/guide/)
   (''https://jsonplaceholder.typicode.com/posts/1'')

keywords of data fetching: 
1. async function
2. await 
3. fetch()
4. yield 
5. response 
6. 



### fetch() 
1. it is a Promise. 
2. it is a genetic function
3. its need url
4. we can use two arguments in the fetch function. 
5. fetch(url , {object})
6. object allow setting up body/ change to http method 
`fetch(url, 
{ body: something, 
method: 'POST'})`
7. always try to keep to 'await' respond in a variable, and it is an object. 
await response is an Object has some properties. 
`respose.ok`
8. fetch() automatically threw an error if it fails to send request. 
but it will by default Not throw an error if we ge an error responds.
we need to use if condition with an Error object in that case.
then it will always throw an error if something goes wrong. 
9. in the new Error() object we can write a message. 
`if(!response.ok){
throw new Error('Failed to fetch data')}`
10. if it is pass and bring the data `success` 
we need to extract that data into JSON format. 
we also keep in a variable by giving a name DATA as JSON also brings a Promise. 
11. Zod library can be used to validate fetching data: https://zod.dev/
12. use unknown for data as it is more type safety than any type. 


### useState for data fetching 
- component that `get()` uses for the data fetching need to use `useState` -as we initially have no data. 
- so we have to manage a state here. 
- with the help of `useState` we need to re-render the component when data is here. 
- it will update the component when it has new data. but we also need to `useEffect` 
- otherwise it will be calling again and again, and that will create an infinite loop.  
- we need to use update() in the `useEffet`

### useEffect
`useEffect(() => {}, [])`
- get function brings a Promise as well. 
- so either we need to use `then()` or await at the beginning. 
- but await only work when a function is async function. 
- but async is not allowing the effect function `useEffect(async(){})` here async is not allowed. 
because `useEffect()` should not `return` a Promise.It should `return` a cleanup function. 
- therefore, we need to use `async` before nested function. 
```javascript
useEffect(() => {
  async function post() {
    await get('https://www.ihatslondon.co.uk')
  }
  post()
}, [])
```
- we need to call the `async function` inside the `useEffect function` before return cleanup. e.g. `post()` here. 















/---------------------------------/
### Alternative: Using the "zod" Library for Response Data Validation
When fetching data, it can be a good idea to parse & validate the fetched data to check if it's in line with our data structure expectations.

A great library for doing that validation is the Zod library because this library embraces TypeScript and is written such that TypeScript is able to infer the structure of the parsed / validated data.


When we are working with Zod (after installing it via npm install zod), our main task is to create a schema for the data we are trying to validate.

For example, when fetching blog posts, we would define the schema for a single blog post:

import { z } from 'zod';

const rawDataBlogPostSchema = z.object({
id: z.number(),
userId: z.number(),
title: z.string(),
body: z.string(),
});
Important: This is JavaScript code! It will be compiled and will execute at runtime.

But, under the hood, it's written such that, during development, TypeScript is able to infer the type of the values that will be parsed / validated via that schema.

Speaking of that, here's how we would use this rawDataBlogPostSchema to validate a value:

const parsedData = rawDataBlogPostSchema.parse(someData)
This will throw an error if someData is not in line with the defined schema (e.g., if a property is missing or of a different value type).

It will return the parsed data if validation succeeds.

The great thing is, that TypeScript now knows the type of parsedData => It will be the type we set up in our schema.

In this example, TypeScript would know that parsedData contains the properties id (number), userId (number), title (string) and body (string).

Therefore, even if someData was any or unknown, parsedData will be a known type.

When using Zod in the course demo app, we could therefore adjust the App component file like this:
```typescript
import { z } from 'zod';
// other imports ...

// outside App component function (since this doesn't need to be re-created all the time)
const rawDataBlogPostSchema = z.object({
id: z.number(),
userId: z.number(),
title: z.string(),
body: z.string(),
});

// z.array() is a Zod method that creates a new schema based on another schema
// as the name suggests, it's simply an array containing the expected objects
const expectedResponseDataSchema = z.array(rawDataBlogPostSchema);

function App() {
// other code like useState() etc ...

useEffect(() => {
async function fetchPosts() {
setIsFetching(true);
try {
const data = await get(
'https://jsonplaceholder.typicode.com/posts'
);
const parsedData = expectedResponseDataSchema.parse(data);
// No more type casting via "as" needed!
// Instead, here, TypeScript "knows" that parsedData will be an array
// full with objects as defined by the above schema
const blogPosts: BlogPost[] = parsedData.map((rawPost) => {
return {
id: rawPost.id,
title: rawPost.title,
text: rawPost.body,
};
});
setFetchedPosts(blogPosts);
} catch (error) {
if (error instanceof Error) {
setError(error.message);
}
// setError('Failed to fetch posts!');
}

      setIsFetching(false);
    }
 
    fetchPosts();
}, []);

// other code ...
}

```


### Alternative: A Generic "get" Function
As always, there are, of course, multiple ways of building the get function.

we could, for example, also build it as a generic function that accepts the expected return value type as a type argument:
```typescript


export async function get<T>(url: string) {
const response = await fetch(url);

if (!response.ok) {
throw new Error('Failed to fetch data.');
}

const data = await response.json() as unknown;
return data as T;
}
```
Now the "Type Casting" ("Type Assertion") takes place right inside the get function to "force" TypeScript to treat data as type T.

T is then set when calling get:

const data = await get<RawDataBlogPost[]>(
'https://jsonplaceholder.typicode.com/posts'
);
This allows we to use get() without having to cast the type to the expected value type.

 whether we prefer this approach whether the approach shown in the videos.

Level-up: Use with Zod

we can also take this to the next level when using Zod (see previous lecture).

we can adjust the get function to accept a second parameter that could be called zodSchema and should be a Zod schema object (of type ZodType).

This Zod schema can then be used inside the get function to parse the received response.
```typescript
import { z } from 'zod';

export async function get<T>(url: string, zodSchema: z.ZodType<T>) {
const response = await fetch(url);

if (!response.ok) {
throw new Error('Failed to fetch data.');
}

const data = (await response.json()) as unknown;

try {
return zodSchema.parse(data);
} catch (error) {
throw new Error('Invalid data received from server.');
}
}
Since Zod would throw an error if parsing the data fails, TypeScript knows that if it succeeds, the data will be a value of the type defined by the Zod schema (i.e., TypeScript will narrow the type to be of that type).

Therefore, no more type casting is needed anywhere. Instead, in the place where get() should be called, we just need to define a Zod schema that describes the expected type and pass it to get().

import { z } from 'zod';


const rawDataBlogPostSchema = z.object({
id: z.number(),
userId: z.number(),
title: z.string(),
body: z.string(),
});

const data = await get('https://jsonplaceholder.typicode.com/posts', z.array(rawDataBlogPostSchema));

data[0].userId; // works => TypeScript knows that userId will exist on the returned data

```