# Read Me


## Todo
1. Fix the *while loop* blocking issue when the production rate increases. How the consumer would perform in such case? would its consumption rate cope with the production rate?
2. Test running the producer for a long time, would the activemq queue overflow? 
3. Try the idea of multiple consumers working in parallel and save messages in a shared repository before sending to redis?
4. implement writing to redis
5. refactor for clean code