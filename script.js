//-----------------------------------------------

class Store {
  constructor(initialState) {
    this.currentState = initialState;
  }

  setStore(newState) {
    const keys = Object.keys(newState);
    const values = Object.values(newState);
    for (let i = 0; i < keys.length; i++) {
      this.currentState[keys[i]] = values[i];
    }
  }

  getStore() {
    return this.currentState;
  }
}

//-----------------------------------------------

class TimeReducer {
  static reduce(state, action) {
    switch (action.type) {
      case "GET_TIME_DAY":
        return {
          timeDay: action.payload,
        };
      case "GET_TIME_NIGHT":
        return {
          timeNightOne: action.payload,
          timeNightTwo: action.payload,
          timeDay: "Я С***Л, МЕНЯ Е***И",
        };
      default:
        return state;
    }
  }
}

// --------------

class DataReducer {
  static reduce(state, action) {
    switch (action.type) {
      case "GET_DATA_WORK":
        return {
          dataWork: action.payload,
        };
      case "GET_DATA_PERSON":
        return {
          dataPerson: action.payload,
        };
      case "GET_DATA_ASYNC":
        return {
          dataAsync: action.payload,
        };
      default:
        return state;
    }
  }
}

// --------------

class RootReducer {
  constructor(key) {
    this.state = {
      timeReducer: TimeReducer.reduce,
      dataReducer: DataReducer.reduce,
    };
    this.current = this.state[key || "timeReducer"];
  }
}

//-----------------------------------------------

class Dispatcher {
  constructor(subject) {
    this.subject = subject;
  }

  dispatch(action) {
    const reducer = new RootReducer(action.reducer);
    this.subject.setStore(reducer.current(this.subject, action));
  }
}

//-----------------------------------------------

class Action {
  constructor(type, payload, reducer) {
    this.type = type;
    this.payload = payload;
    this.reducer = reducer;
  }
}

class ActionFactory {
  constructor(reducer) {
    this.reducer = reducer;
  }

  create(type, payload) {
    return new Action(type, payload, this.reducer);
  }
}

//-----------------------------------------------

const TimeType = {
  GET_TIME_DAY: "GET_TIME_DAY",
  GET_TIME_NIGHT: "GET_TIME_NIGHT",
};

const actionTimeFactory = new ActionFactory("timeReducer");

const getTimeDay = actionTimeFactory.create(TimeType.GET_TIME_DAY, {
  "02.02.2002": "15:00",
});

const getTimeNight = actionTimeFactory.create(TimeType.GET_TIME_NIGHT, {
  "02.02.2002": "23:00",
});

// --------------

const DataType = {
  GET_DATA_PERSON: "GET_DATA_PERSON",
  GET_DATA_WORK: "GET_DATA_WORK",
  GET_DATA_ASYNC: "GET_DATA_ASYNC",
};

const actionDataFactory = new ActionFactory("dataReducer");

const getDataPerson = actionDataFactory.create(DataType.GET_DATA_PERSON, {
  person: {
    male: ["NIKOLAY PETROV"],
    woman: ["SONYA POPOVA"],
  },
});

const getDataWork = actionDataFactory.create(DataType.GET_DATA_WORK, {
  work: {
    developer: ["js", "ts", "java", "c++", "c#", "YoptaScript"],
  },
});

const fetchAsync = async () => {
  const response = await fetch("http://jservice.io/api/random?count=1", {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

//-----------------------------------------------

const store = new Store({});
const disp = new Dispatcher(store);

const getDataAsync = fetchAsync().then((data) => disp.dispatch(actionDataFactory.create(DataType.GET_DATA_ASYNC, data)));

console.log(store.getStore(), "6", "getDataAsync - async fetch");

disp.dispatch(getTimeDay);

console.log(store.getStore(), "2", "getTimeDay");

disp.dispatch(getTimeNight);
disp.dispatch(getTimeNight);

console.log(store.getStore(), "3", "getTimeNight x2 + modify timeDay");

// disp.dispatch(getDataPerson);

// console.log(store.getStore(), "4", "getDataPerson - another reducer");

// disp.dispatch(getDataWork);

// console.log(store.getStore(), "5", "getDataWork");

// const getDataAsync = fetchAsync().then((data) => disp.dispatch(actionDataFactory.create(DataType.GET_DATA_ASYNC, data)));

// console.log(store.getStore(), "6", "getDataAsync - async fetch");
