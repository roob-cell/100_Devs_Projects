document.querySelector("button").addEventListener("click", getFetch)

function getFetch(){
    const choice = document.querySelector("input").value.replaceAll(" ", "-").replaceAll("."," ").toLowerCase()
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const potentialPet = new PokeInfo(data.name, data.height, data.weight, data.types, data.sprites.other["official-artwork"].front_default, data.location_area_encounters)
            
            potentialPet.getTypes()
            potentialPet.isItHousePet()
            
            let decision = ""
            if(potentialPet.housepet){
                decision = `This pokemon is small enough, light enough and safe enough to be a good pet! You can find ${potentialPet.name} in the following location(s)`
                potentialPet.encounterInfo()
            }else {
                decision = `This pokemon would not be a good pet because ${potentialPet.reason.join(" and ")}.`
                document.getElementById("locations").innerText = ""
            }
            document.querySelector("h2").innerText = decision
            document.querySelector("img").src = potentialPet.image
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}

class Poke {
    constructor (name, height, weight, types, image) {
        this.name = name
        this.height = height
        this.weight = weight
        this.types = types
        this.image = image
        this.housepet = true
        this.reason = []
        this.typeList = []
    }

    getTypes() {
        for (const property of this.types) {
            this.typeList.push(property.type.name)
        }
        console.log(this.typeList)
    }

    weightToPounds(weight) {
        return Math.round(weight/4.536)*100/100
    }

    heightToFeet(height) {
        return Math.round(height/3.048*100)/100
    }

    isItHousePet() {
        //Check height, weigth, and type
        let badTypes = ['fire', 'electric', 'fighting', 'poison', 'psychic', 'ghost']
        let weightConv = this.weightToPounds(this.weight)
        let heightConv = this.heightToFeet(this.height)
        if(weightConv > 400) {
            this.reason.push(`is it too heavy at ${weightConv} pounds`)
            this.housepet = false
        }
        if(heightConv > 7) {
            this.reason.push(`it is too tall at ${heightConv} feet`)
            this.housepet = false
        }
        if(badTypes.some(r=> this.typeList.indexOf(r) >= 0)) {
            this.reason.push("its type is too dangerous")
            this.housepet = false
        }
    }
}

class PokeInfo extends Poke {
    constructor(name, height, weight, types, image, location) {
        super(name, height, weight, types, image)
        this.locationURL = location
        this.locationList = []
        this.locationString = ""
    }

    encounterInfo() {
        fetch(this.locationURL)
        .then( res => res.json())
        .then(data => {
            console.log(data)
            for(const item of data) {
                this.locationList.push(item.location_area.name)
            }
            let target = document.getElementById("locations")
            target.innerText = this.locationCleanup()
        })
    }

    locationCleanup() {
        const words = this.locationList.slice(0, 5).join(", ").replaceAll("-"," ").split(" ")
        for(let i = 0; i<words.length; i++){
            words[i] = words[i][0].toUpperCase() + words[i].slice(1)
        }
        return words.join(" ")
    }
}    
