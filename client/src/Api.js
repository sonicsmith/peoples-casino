import ImageData from "./components/ImageData"
import random from "random"
import seedrandom from "seedrandom"

const external_url = `http://thissite`
const firstNames = ["Steve", "Sam", "Peter", "Patel", "Wally", "Justin"]
const lastNames = ["Sanderson", "Harris", "Wetwool", "Smithson"]
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
  const rnd = random.int(0, array.length - 1)
  console.log(array[rnd])
  return array[rnd]
}

const getTokenMetadata = () => {
  const randomContainer = getRandomEntry(containerNames)
  const randomObject = getRandomEntry(objectNames)
  const randomSecondObject = getRandomEntry(secondObjectNames)
  const description = `Welcome to the ${randomContainer} of ${randomSecondObject}s, 
where you can make a whole heap of money by finding a ${randomObject} 
in my ${randomContainer} full of ${randomSecondObject}s`
  return {
    name: `${getRandomEntry(firstNames)} ${getRandomEntry(lastNames)}`,
    description,
    external_url,
    attributes
  }
}

const Api = ({ tokenId }) => {
  random.use(seedrandom(`${tokenId}`))
  const tokenMetadata = getTokenMetadata()
  // tokenMetadata.image_data = <ImageData tokenId={tokenId} /> // TODO: Stringify svg
  return JSON.stringify(tokenMetadata)
}

export { Api, getTokenMetadata }
