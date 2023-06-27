# Method
Method SWE Assignment Lean

## TODO
1) Read Method docs and plan out course of action
  - which endpoints to use
2) XML file upload and file parsing (to JSON)
  - requires dummy UI for file upload
3) TBD from 1 but should interface w Method API to create necessary resources (entities, accounts and payments)
  - entities (employee as an identifier, employer entity as payor, and plaid account as the payee?)
    - accounts (ACH, liability, etc)
  - payments ()
4) Y/N endpoint to initiate payment to entities
5) Generate CSV reports
 - Total amount of funds paid out per unique source account (likely distinguished from the Payor tag)
 - Total amount of funds paid out per Dunkin branch
 - The status of every payment and its relevant metadata (store batch table with incrementing ID (FK) with file name and time stamp, entity table containing entity ID from method and each has a batch FK)
 6) UI/FE
