### Run

install dependencies

```
npm install

```

run app

```	
npm run start
```

### queries

Open http://localhost:4000/

```

count:

query{
  personCount
}

getAll

query {
  allPersons {
    name
    phone
    address {
      city
      street
    }
  }
}

findByName

query {
  findPerson(name : "Juan") {
    #get the person with the ID of 1
    name
    id
    address {
      city
      street
    }
  }
}

addPerson

mutation {
  addPerson (
    name: "pablo"
    phone: "12547896"
    street: "aca vive pablo"
    city: "chillan"
  ){
    id
    name
    phone
    address {
      city
      street
    }
  }
}
```
