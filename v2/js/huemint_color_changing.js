
// function rgbToHsl(rgb) {
//     let r = rgb[0] / 255,
//         g = rgb[1] / 255,
//         b = rgb[2] / 255,
//         max = Math.max(r, g, b),
//         min = Math.min(r, g, b),
//         h, s, l = (max + min) / 2;

//     if (max == min) {
//         h = s = 0; 
//     } else {
//         let diff = max - min;
//         s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
//         switch (max) {
//             case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
//             case g: h = (b - r) / diff + 2; break;
//             case b: h = (r - g) / diff + 4; break;
//         }
//         h /= 6;
//     }
//     return [ h * 360, s * 100, l * 100 ];
// }

// function lightenOrDarkenColor(color, amount) {
//     // Convert color from hexadecimal to RGB
//     let rgbColor = color.slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16));
    
//     // Convert RGB to HSL
//     let hslColor = rgbToHsl(rgbColor);

//     // Adjust lightness
//     hslColor[2] = Math.min(Math.max(0, hslColor[2] + amount), 100);

//     // Return the color in HSL format
//     return `hsl(${hslColor[0]}, ${hslColor[1]}%, ${hslColor[2]}%)`;
// }

// function printColor(color) {
//     console.log(`%c ${color} `, `color: ${color}`);
// }




// let json_data = {
//     "mode":"transformer",
//     "num_colors":4,
//     "temperature":"1.2",
//     "num_results":50,
//     "adjacency":[ "0", "75", "55", "35",
//                   "75", "0", "0", "0", 
//                   "55","0", "0", "0",
//                    "35", "0", "0", "0"],
//     "palette":["-", "-", "-", "-"],
// }
// let color_data;
// fetch('https://api.huemint.com/color', {
//     method: 'POST', 
//     headers: {
//     'Content-Type': 'application/json;charset=utf-8'
//     },
//     body: JSON.stringify(json_data) 
// })
// .then(response => response.json())
// .then((data) => {
//     color_data = data["results"]; 
//     console.log(color_data)
//     let randomIndex = Math.floor(Math.random() * color_data.length);
//     console.log(color_data[randomIndex]["palette"]);
//     color_data[randomIndex]["palette"].forEach((color, index) => {
//         console.log(`%c--color-${index}: + ${color}`,  `color: ${color}`);
//         document.documentElement.style.setProperty(`--color-${index}`, color);

//         let rgbColor = color.slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16)); 
//         let hslColor = rgbToHsl(rgbColor);
//         console.log(`%c--color-${index}-lighter rgbColor: ${rgbColor} hslColor: ${hslColor}`, `hsl(${hslColor[0]}, ${hslColor[1]}%, ${hslColor[2] + 20}%)`);
//         document.documentElement.style.setProperty(`--color-${index}-lighter`, lightenOrDarkenColor(color, 20));
//     });

//     // // Convert color to HSL
//     // let color1HSL = rgbToHsl(color1);

//     // document.documentElement.style.setProperty('--color-1-lighter', `hsla(${color1HSL[0]}, ${color1HSL[1]}%, ${color1HSL[2] + 10}%, 1)`);
//     // document.documentElement.style.setProperty('--color-1-light', `hsla(${color1HSL[0]}, ${color1HSL[1]}%, ${color1HSL[2] + 20}%, 1)`);
//     // document.documentElement.style.setProperty('--color-1-dark', `hsla(${color1HSL[0]}, ${color1HSL[1]}%, ${color1HSL[2] - 20}%, 1)`);
//     // document.documentElement.style.setProperty('--color-1-darker', `hsla(${color1HSL[0]}, ${color1HSL[1]}%, ${color1HSL[2] - 30}%, 1)`);
// })
// .catch((error) => console.error('Error:', error));
