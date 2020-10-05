
API Collection Postman-https://www.getpostman.com/collections/3af9e1985f04b9adfc45
Examples contain the most frequent request and responses.

For source code please refer the-
Github link - https://github.com/navtrip/smallcasetask

API General Flow :-
Routes -> Payload Validation -> Controller -> Services

List of APIs:-


All Trades
/trades/all
GET
Get all trades active inactive

Portfolio
/portfolio/
GET
Get Portfolio

Returns
/portfolio/returns
GET
Get Portfolio returns based on avg prices

Buy Trade
/transaction/buy
POST
Buy Security

Sell Trade
/transaction/sell
POST
Sell Security

Update Trade
/transaction/update
PATCH
Update a transaction field

Delete Trade
/transaction/?id={trade_id}
DELETE
Delete a transaction by ID


DB :-
Postgres
ODM/ORM - Sequelize

Hosting:-
App is hosted on AWS ec2 instance, process manager- pm2.
DB hosted on RDS instance

Other Info:-

Every transactional API usage managed transactions with commit and rollback.

“Joi” - Used for payload validation.

Limitation -

Update API can update all trades fields, it only accepts one update field at a time.



