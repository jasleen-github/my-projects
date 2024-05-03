const fruitImages = [
    require('../assets/fruit-1.png'),
    require('../assets/fruit-2.png'),
    require('../assets/fruit-3.png'),
    require('../assets/fruit-4.png'),
    require('../assets/fruit-5.png'),
    require('../assets/fruit-6.png'),
    require('../assets/fruit-7.png'),
    require('../assets/fruit-8.png'),
    require('../assets/fruit-9.png'),
    require('../assets/fruit-10.png'),
    require('../assets/fruit-11.png'),
    require('../assets/fruit-12.png'),
    require('../assets/fruit-13.png'),
    require('../assets/fruit-14.png'),
    require('../assets/fruit-15.png'),
    require('../assets/fruit-16.png'),
    require('../assets/fruit-17.png'),
    require('../assets/fruit-18.png'),
    require('../assets/fruit-19.png'),
    require('../assets/fruit-20.png'),
    require('../assets/fruit-21.png'),
    require('../assets/fruit-22.png'),
    require('../assets/fruit-23.png'),
    require('../assets/fruit-24.png'),
    require('../assets/fruit-25.png'),
];

export const RandomImageSource = () => {
    const index = Math.floor(Math.random() * (24 - 0 + 1));
    return fruitImages[index];
}