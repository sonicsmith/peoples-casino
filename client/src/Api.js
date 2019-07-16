import ImageData from "./components/ImageData"
const external_url = `http://thissite`
const firstNames = ["Steve", "Sam", "Peter", "Patel", "Wally", "Justin"]
const lastNames = ["Sanderson", "Harris", "Wetwool"]
const containerNames = ["barrel", "stadium", "room", "house", "van", "planet"]
const objectNames = ["monkey", "fish", "sandwich", "twig", "tv"]
const secondObjectNames = ["pen", "needle", "marble", "leaves"]

const attributes = [
  {
    trait_type: "base",
    value: "starfish"
  }
]

const getRandomEntry = array => {
  const size = array.length
  const rnd = Math.floor(Math.random() * size)
  return array[rnd]
}

const randomContainer = getRandomEntry(containerNames)
const randomObject = getRandomEntry(objectNames)
const randomSecondObject = getRandomEntry(secondObjectNames)

const description = `Welcome to the ${randomContainer} of ${randomSecondObject}s, 
where you can make a whole heap of money by finding a ${randomObject} 
in my ${randomContainer} full of ${randomSecondObject}s`

const tokenMetadata = {
  name: `${getRandomEntry(firstNames)} ${getRandomEntry(lastNames)}`,
  description,
  external_url,
  image_data: ImageData,
  attributes
}

const Api = () => {
  return JSON.stringify(tokenMetadata)
}

export { Api, tokenMetadata }
