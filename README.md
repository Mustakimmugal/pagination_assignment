This project is built using React + TypeScript + Vite.
It displays artworks from the Art Institute of Chicago API in a paginated data table.

The application implements:-
Server-side pagination
Persistent row selection across pages
Custom bulk selection using an overlay panel
Efficient state management without storing unnecessary data

Tech Stack:-

React
TypeScript
Vite
PrimeReact
Axios

Features
Server-Side Pagination
Data is fetched page-by-page from the API.
No unnecessary prefetching of other pages.

Persistent Row Selection
Selected rows remain selected even when navigating between pages.
Selection is tracked using unique row IDs.

Custom Bulk Selection
Users can enter a number (e.g., 20).
The first N rows (based on global index) are selected.
No additional API calls are triggered for bulk selection.

Optimized API Usage
API is only called when:-
Page changes
Page size changes
No loop fetching
No full dataset storage

How Selection Works
Selections are managed using:-
A global selected ID state

Computed global index using:-
const gIdx = ((page - 1) \* rows) + idx + 1;

This ensures:-
Selection works across pages
No need to fetch all pages
Efficient memory usage

Installation & Setup

Clone the repository:-
git clone:- https://github.com/Mustakimmugal/pagination_assignment.git
cd <assinment fb>

Install dependencies:-
npm install

Run locally:-
npm run dev

Build for production:-
npm run build

Deployment-

The project is deployed using Netlify.
Live URL:-https://artass.netlify.app/

GitHub Repository:-
