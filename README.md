# sruthi-ganesh-software-engineer-5Apr2022
## Restaurant Application

Built a simple user-facing web along with a login/registration flow that allows the user to filter for restaurants open by date time as well as restaurant name. On top of that, users can save restaurants into their own named collections (eg. Vegetarian favourites, Meat-lovers etc.).

This is the raw data for restaurant opening hours - (https://gist.githubusercontent.com/seahyc/7ee4da8a3fb75a13739bdf5549172b1f/raw/f1c3084250b1cb263198e433ae36ba8d7a0d9ea9/hours.csv).

Uses the following stacks
1. Django
2. Elastic Search
3. Celery
4. React
5. Redux & Redux Saga
6. Docker
7. AWS EC2


### Authentication
Uses token based authentication and each API is restricted to use tokens. 
Note: Refreshing the page invalidates the token as it is not added as a part of HTTP Cookie.

### Backend
**Django**:
The backend is built on **Django** with **Postgres** as the database. Django uses the following APIs for REST data transfer. All APIs start with /api.
1. auth/register/ - To register new users with email, password, first name and last name
2. auth/login/ - To login with registered users with email and password
3. res/restaurant/ - To get all restaurants based on the filter such as page, orderby, open weekday and time.
4. res/collections/ - To get all user collections created by the user which also contains respective restaurants added to it

**Elastic Search**:
This web app uses elastic search to search for restaurants that are alr**eady indexed. The following APIs django use to communicate with elastic search.
1. search/ - fast searches based on the filter provided such as page, orderby, open weekday and time.
2. search/suggest - Provides title suggestions/auto completes for a string of characters provided  

**Celery**:
Whenever a collection is created or updated, the elastic search is indexed by running it in the background as a Celery task. Redis acts as the queue manager for celery

### FrontEnd
**React**:
Built a beautiful styled web app for viewing restaurants also sorting and filtering them. Users can add a new collection, add restaurants to the a collection and add a restaurant to single collection

**Redux**
Using redux for state management which stores current page information, filter information, auth tokens etc. Using redux saga to run actions whenever a state changes example: whenever a page number is clicked from pagination, the corresponding page is loaded.

### Deployment
**Docker**
Build the entire app with Docker Compose. Has the following containers
1. Web - Django
2. Celery 
3. Redis
4. Postgres
5. Nginx
6. Elastic Search


## How to use the app

### Register and Login
1. Click on "Create a new account instead"
<img width="1612" altnt="Screenshot 2022-04-05 at 21 51 57" src="https://user-images.githubusercontent.com/26520098/161801079-f04b7f8a-82f7-454a-a45a-29352d1fcfc1.png">
2. Enter your information and click on Sign Up
<img width="1612" alt="Screenshot 2022-04-05 at 21 48 59" src="https://user-images.githubusercontent.com/26520098/161801166-f3c8a522-6796-4ba2-a447-4efd55c82e31.png">
3. Enter your login information in sign in page (it automatically redirects post register)
<img width="1612" alt="Screenshot 2022-04-05 at 21 58 07" src="https://user-images.githubusercontent.com/26520098/161801783-dd5b6587-907b-4853-a3e5-a8a36fcd47bf.png">

### Home Page
<img width="1792" alt="Screenshot 2022-04-05 at 22 00 07" src="https://user-images.githubusercontent.com/26520098/161802060-a696a973-f211-4379-97fd-99a8b74aee3f.png">

### Filter
Filter by has three values
1. Open Now - Currently open restaurants at today's UTC day and UTC time
2. Open Any Time - Open all time restaurants but currently open are marked as open

<img width="1158" alt="Screenshot 2022-04-05 at 22 00 52" src="https://user-images.githubusercontent.com/26520098/161802215-304ced02-bc62-40eb-bce3-24010263b240.png">

3. Custom Filter - Can sort by any day of week and any UTC time

<img width="1158" alt="Screenshot 2022-04-05 at 22 02 41" src="https://user-images.githubusercontent.com/26520098/161802561-deeb98a7-2a74-46f0-8844-98f7f07e1a0b.png">
<img width="1158" alt="Screenshot 2022-04-05 at 22 02 46" src="https://user-images.githubusercontent.com/26520098/161802578-ee3efbdb-e18a-47cd-9a6a-9c524c06659b.png">

After choosing the filter, click on Filter results button. Now page is refreshed with filter data

### Sort
Sort by two values
1. None - no sort
2. Title - sort by title

Sort can be used with any combination of filter

<img width="1158" alt="Screenshot 2022-04-05 at 22 04 33" src="https://user-images.githubusercontent.com/26520098/161802853-62fe6eb0-2b8b-4e3b-9c8b-54dd0980cb5e.png">

After choosing the sort, click on Filter results button. Now page is refreshed with filter data

### Search
Enter search values to the search text field. Click on Filter Results to see the changes. 
Plus: Search also returns fuzzy results.

<img width="1158" alt="Screenshot 2022-04-05 at 22 06 35" src="https://user-images.githubusercontent.com/26520098/161803228-f9a72f54-175e-413b-9069-fb642db84317.png">

<img width="1489" alt="Screenshot 2022-04-05 at 22 07 22" src="https://user-images.githubusercontent.com/26520098/161803344-5aada3c6-fb91-44e8-a810-04413948f251.png">

### Pagination
Scroll to the bottom of the page and look for pagination. Click on corresponding page numbers to navigate to that page

<img width="1773" alt="Screenshot 2022-04-05 at 22 08 35" src="https://user-images.githubusercontent.com/26520098/161803603-040d25a3-88cd-4e49-b8ee-713b85ee9397.png">

Example: Page number 8 selected

<img width="1773" alt="Screenshot 2022-04-05 at 22 09 33" src="https://user-images.githubusercontent.com/26520098/161803744-55be33d9-1b30-407b-8fe9-68da2fe7d203.png">

### Creating a new collection
Click on Add new collection

<img width="264" alt="Screenshot 2022-04-05 at 22 10 39" src="https://user-images.githubusercontent.com/26520098/161804172-8591e329-2149-4cfc-922b-71fc1e0b0017.png">

A modal opens up. Enter title to the collection modal. Click on "Add" button

<img width="449" alt="Screenshot 2022-04-05 at 22 14 14" src="https://user-images.githubusercontent.com/26520098/161804679-3ea68ed0-965d-486e-8a20-62de8340e148.png">

You can see the added collection listed here

<img width="262" alt="Screenshot 2022-04-05 at 22 15 24" src="https://user-images.githubusercontent.com/26520098/161805004-a1a2e3ff-dc31-4543-9be7-2b2dce228553.png">

### Adding a restaurant to multiple collections

Click on "+" icon of any restaurant card. 

<img width="960" alt="Screenshot 2022-04-05 at 22 16 57" src="https://user-images.githubusercontent.com/26520098/161809256-37852b2b-60f4-4670-b540-87248587614f.png">

A modal will open. Choose the suitable collections. Click on Add

<img width="429" alt="Screenshot 2022-04-05 at 22 31 42" src="https://user-images.githubusercontent.com/26520098/161809814-d0150854-9afb-46b9-b605-100b5c1ba95a.png">

### Adding multiple restaurants to a collection

Click on the corresponding collection you want to add restaurants to

<img width="266" alt="Screenshot 2022-04-05 at 22 58 29" src="https://user-images.githubusercontent.com/26520098/161815225-a220d63c-4884-4240-b9a4-dad05b9e28cf.png">


Click on the ellipsis icon from the collection page

<img width="1508" alt="Screenshot 2022-04-05 at 22 56 58" src="https://user-images.githubusercontent.com/26520098/161815117-ea1316bb-4683-4a65-9567-b862d3bb5148.png">


Click on Add Restaurants

<img width="1503" alt="Screenshot 2022-04-05 at 22 59 22" src="https://user-images.githubusercontent.com/26520098/161815450-7c7afa03-4480-4400-a7cc-95d4be752948.png">

Modal opens up. Search for restaurants to add them to collection and click on Add

<img width="707" alt="Screenshot 2022-04-05 at 23 00 55" src="https://user-images.githubusercontent.com/26520098/161815578-5be8c8f7-1724-4cd0-b9b5-a28aab1ade99.png">

Updated list

<img width="1503" alt="Screenshot 2022-04-05 at 23 01 37" src="https://user-images.githubusercontent.com/26520098/161815676-fcdb9074-bab6-43d3-8de2-849b616f4076.png">

### Navigate to Homepage
Navigate to homepage screen by clicking on HomePage menu 

<img width="266" alt="Screenshot 2022-04-05 at 22 58 29" src="https://user-images.githubusercontent.com/26520098/161815739-c4e761a2-b121-481c-a2b7-cfa0fa1fdf92.png">

### Signing out
Sign out by clicking on the sign out button from sidepane

<img width="271" alt="Screenshot 2022-04-05 at 23 02 42" src="https://user-images.githubusercontent.com/26520098/161815837-a336594f-1cf0-4983-ad3e-6e983c553d13.png">


