import { fakerEN_IN } from '@faker-js/faker';

export default function getMatches(numberOfMatches = 10) {
    const matches = [];
    for (let i = 0; i < numberOfMatches; i++) {
        fetch("https://dog.ceo/api/breeds/image/random")
            .then((response) => response.json())
            .then((result) => console.log(result));
    }
}

function getIndiaProfile() {
    return{
        name: fakerEN_IN.person.fullName(),
        bio: fakerEN_IN.person.bio(),
        streetAdress: fakerEN_IN.location.streetAddress(),
    }
}
console.log(getIndiaProfile());