# Import Data
env <- read.table ("AttribMMIModel_091812.txt",header=TRUE,sep=",",row.names=1)
transenv <- read.table ("AttribMMIModelTransform_091812.txt",header=TRUE,row.names=1)

 
"MMI"      "LogIC"    "SqrtWET"  "SqrtSLP"  "Forest"   "LogAG"    "LogSTRKM" "SqrtELEV" "LogDEV"   "LogOW" 

#  Create Model Selection Tables
library (AICcmodavg)

##setup a subset of models
Cand.models <- list( )
Cand.models[[1]] <- lm(MMI ~ LogIC+SqrtWET+SqrtSLP+LogAG+LogSTRKM+SqrtELEV+LogOW, data = transenv)
Cand.models[[2]] <- lm(MMI ~ Forest+SqrtWET+SqrtSLP+LogAG+LogSTRKM+SqrtELEV+LogOW, data = transenv)
Cand.models[[3]] <- lm(MMI ~ LogIC+SqrtWET+SqrtSLP, data = transenv)
Cand.models[[4]] <- lm(MMI ~ LogIC+SqrtWET+SqrtSLP+LogAG, data = transenv)
Cand.models[[5]] <- lm(MMI ~ Forest+SqrtWET+SqrtSLP+LogAG, data = transenv)
Cand.models[[6]] <- lm(MMI ~ Forest+SqrtWET+SqrtSLP, data = transenv)
Cand.models[[7]] <- lm(MMI ~ LogIC, data = transenv)
Cand.models[[8]] <- lm(MMI ~ LogIC, data = transenv)
Cand.models[[9]] <- lm(MMI ~ LogIC+SqrtWET, data = transenv)
Cand.models[[10]] <- lm(MMI ~ LogIC+SqrtSLP, data = transenv)
##create a vector of names to trace back models in set
Modnames <- paste("mod", 1:length(Cand.models), sep = " ")
##generate AICc table
aictab(cand.set = Cand.models, modnames = Modnames, sort = TRUE)
##round to 4 digits after decimal point and give log-likelihood
print(aictab(cand.set = Cand.models, modnames = Modnames, sort = TRUE),digits = 4, LL = TRUE)

##compute model-averaged estimate
modavg(cand.set = Cand.models, parm= "LogIC", modnames = Modnames)

##setup a subset of models
Cand.models <- list( )
Cand.models[[1]] <- lm(MMI ~ Forest, data = transenv)
Cand.models[[2]] <- lm(MMI ~ Forest+SqrtWET, data = transenv)
Cand.models[[3]] <- lm(MMI ~ Forest+SqrtSLP, data = transenv)
Cand.models[[4]] <- lm(MMI ~ LogIC+SqrtWET+SqrtSLP, data = transenv)
Cand.models[[5]] <- lm(MMI ~ LogIC+SqrtWET+SqrtSLP+LogAG, data = transenv)
Cand.models[[6]] <- lm(MMI ~ Forest+SqrtWET+SqrtSLP+LogAG, data = transenv)
Cand.models[[7]] <- lm(MMI ~ Forest+SqrtWET+SqrtSLP, data = transenv)
Cand.models[[8]] <- lm(MMI ~ LogIC, data = transenv)
Cand.models[[9]] <- lm(MMI ~ LogIC+SqrtWET, data = transenv)
Cand.models[[10]] <- lm(MMI ~ LogIC+SqrtSLP, data = transenv)
##create a vector of names to trace back models in set
Modnames <- paste("mod", 1:length(Cand.models), sep = " ")
##generate AICc table
aictab(cand.set = Cand.models, modnames = Modnames, sort = TRUE)
##round to 4 digits after decimal point and give log-likelihood
print(aictab(cand.set = Cand.models, modnames = Modnames, sort = TRUE),digits = 4, LL = TRUE)