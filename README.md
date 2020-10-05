# yf_stocks

Node based APP which implements cache based Stock analysis and NEWS APIs

#install dependencied
npm i

#run the app
npm start

#cache TTL can be set using Config- current values in secs
NEWSTTL : 120
ANLYSISTTL : 180

#Stock Analysis
http://localhost:3000/stock/analysis?symbol=AMRN

#Stock News - Default region is set as US (Valid options can be found in validations)
http://localhost:3000/stock/news?symbol=NBEV&region=

PS- first time user will face a real time delay to get the response.
