# Node
The ***node*** directory contains the code of the services that run on ***NodeJS***.

## Services
### **Database**
This service is the interface that communicates with the ***MongoDB*** database.  Any communication needed to be done to the database should be done here.

### **Proxy**
This service is the interface that proxies requests to the desired services.  At the moment this service proxies requests to either the realtime or historical server service.