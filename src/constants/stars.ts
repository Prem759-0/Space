
export interface StarData {
  id: string;
  name: string;
  distance: string; // light years
  description: string;
  color: string;
  temperature: number; // Kelvin
  size: number;
}

export const FAMOUS_STARS: StarData[] = [
  {
    id: 'sun',
    name: 'The Sun',
    distance: '0',
    description: 'The star at the center of our Solar System. A G-type main-sequence star that makes up about 99.8% of the total mass of the Solar System.',
    color: '#ffcc33',
    temperature: 5778,
    size: 2.0
  },
  {
    id: 'sirius',
    name: 'Sirius',
    distance: '8.6',
    description: 'The brightest star in the night sky. Also known as the Dog Star, it is a binary star system in the constellation Canis Major.',
    color: '#e6ffff',
    temperature: 9940,
    size: 1.8
  },
  {
    id: 'centauri',
    name: 'Alpha Centauri',
    distance: '4.37',
    description: 'The closest star system to the Solar System. It consists of three stars: Rigil Kentaurus, Toliman, and Proxima Centauri.',
    color: '#fff5f2',
    temperature: 5790,
    size: 1.5
  },
  {
    id: 'vega',
    name: 'Vega',
    distance: '25',
    description: 'The brightest star in the northern constellation of Lyra. It was once the northern pole star and will be again in 12,000 years.',
    color: '#d6ebff',
    temperature: 9602,
    size: 1.6
  },
  {
    id: 'arcturus',
    name: 'Arcturus',
    distance: '36.7',
    description: 'A red giant star in the Northern Hemisphere constellation of Boötes. It is the fourth-brightest star in the night sky.',
    color: '#ffcc99',
    temperature: 4286,
    size: 2.5
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    distance: '642.5',
    description: 'A red supergiant of spectral type M1-2 and one of the largest stars visible to the naked eye.',
    color: '#ff6600',
    temperature: 3500,
    size: 3.5
  },
  {
    id: 'polaris',
    name: 'Polaris',
    distance: '433',
    description: 'The North Star. It is a multiple star, comprising the main star α Ursae Minoris Aa, which is a yellow supergiant.',
    color: '#ffffcc',
    temperature: 6015,
    size: 1.4
  }
];
