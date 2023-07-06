# Method
Method SWE Assignment Lean

##### Table of Contents
* [How to run](https://github.com/hsu-isaac/method#how-to-run)
* [Notes](https://github.com/hsu-isaac/method#notes)
    * [Outline](https://github.com/hsu-isaac/method#outline)
    * [The Issue](https://github.com/hsu-isaac/method#the-issue)
* [TODO](https://github.com/hsu-isaac/method#the-issue)

## How to run
1) Open ~/method/server in your terminal and run
    ```
    npm start
    ```
2) Open ~/method/client in your terminal and run
    ```
    yarn start
    ```
3) Click on the "Choose File" button and select your XML payment file
4) Click on the "Upload!" button
5) Click on the "Click to process payment" button once it appears

## Notes
Unfortunately I did not have enough time to complete the entire assignment though I have outlined what needs to be done for 
the remainder of the assignment. There was one issue that I was particularly stuck on and had spent a lot of time speculating
how to resolve.
### Outline
1) "Before payment processing starts the dashboard should display in a “succinct way” all the payments we are about to 
    initiate."
     - Use yarn to install Elastic UI (not npm compatible)
     - Modify the response payload from "/api/uploadfile" to include the display information (Name of individual, Name 
        of Payor, Name of Payee, Amount)
     - Create a [basic table using Elastic UI](https://elastic.github.io/eui/#/tabular-content/tables#a-basic-table)
     - Create a discard button to clear the batch
2)  CSVs
     1) for total amount of funds paid out per unique source account
        - Add accounts table to local DB to keep track of `accountId` and use `method.payments.list('{source_holder_id}')`
     2) for total amount of funds paid out per Dunkin' Branch
         - Store `dunkin_id` in local DB
         - Query for `entity_id`
         - Call `method.accounts.list('{holder_id}')`
         - Sum up amount from all the returns
     3) for status of every payment and its relevant metadata
         - Call `method.payments.list()` and pull metadata from the response and associate it with the payment id

    (Would also have to create endpoints/functions to write into CSV files)

3)  "The Method API has a 600 requests per IP per minute rate-limit. When the 601st request in that minute a 429 will be 
    issued."
    - A naive solution would be to batch the request, but we have to remember that each "payment" includes API calls for 
        the creation of: individual entities, corporation entities, source accounts, liability accounts, and payments so the batches 
        must be particularly small. Even if entities/accounts were preexisting we would have to do a lookup call unless we have an 
        extensive local DB
    - A more optimized solution would require a more extensive local (Dunkin') DB which performs a DB call for the entities 
        and accounts. While this would create more time lag, it would save Dunkin' on being charged for more API calls and allow for 
        larger batch sizes
4)  Code cleanup
    - Client-side
        - Make react components more modular and pass props between each other
    - Server-side
        - Add error handling
        - Add tests

### The Issue
How can I verify if an entity has beeen previously created?

From my understanding of the Method API, the only way to verify the existence of an entity is to use `/entities/:entity_id`, however
this requires a local DB to store the IDs. I wasn't sure if this was within the scope of the assessment but I could not find another
way to resolve this issue. I created a very simple DB schema that would allow us to store the necessary information. The Method API 
could potentially prevent duplicates, but in that case the `method.entities.create('{data}')` POST will likely return an error and 
not return the `entity-id` needed, so there would still be a need for a local DB. Building off of the need for a local DB I imagine
the client would need to essentially mimic the Method DB locally to prevent excessive calls (i.e. costs) and automatically update their 
local DB whenever calls/changes are made to the Method API/DB. 

I would love to know if I was overthinking this issue or if I missed something in the documentation that would help resolve this.


## TODO
1) ~~Read Method docs and plan out course of action~~
    - ~~which endpoints to use~~
2) ~~XML file upload and file parsing (to JSON)~~
    - ~~requires dummy UI for file upload~~
3) ~~TBD from 1 but should interface w Method API to create necessary resources (entities, accounts and payments)~~
    - ~~entities (employee as an identifier, employer entity as payor, and plaid account as the payee?)~~
    - ~~accounts (ACH, liability, etc)~~
    - ~~payments ()~~
      
   3b) ~~Logic within function to read XML payment requests one at a time~~
4) ~~Y/N endpoint to initiate payment to entities~~
5) UI to show entities to confirm
6) Create and link DB to have table for batch updates and entities
7) Generate CSV reports
   - Total amount of funds paid out per unique source account (likely distinguished from the Payor tag)
   - Total amount of funds paid out per Dunkin branch
   - The status of every payment and its relevant metadata (store batch table with incrementing ID (FK) with file name and time stamp, entity table containing entity ID from method and each has a batch FK)
 8) UI/FE
