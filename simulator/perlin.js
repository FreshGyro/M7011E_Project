
const tableSize = 4096;
const table = [];
for(let i = 0; i < tableSize; ++i) {
	table[i] = (Math.random() * 2) - 1;
}

function interpolateLinear(a, b, x) {
	return a + x * (b - a);
}

function seed3D(seed, x, y, z) {
	let	a = (x + 1376312589) * 53;
	a ^= 0x3F5E6401;
  a = (a << 13) ^ a;

	let b = (y + 1673550775) * 57;
	b ^= 0xF4C870BF;
	b = (b << 12) ^ b;

	let	c = (z + 1712851296) * 55;
	c ^= 0xC0516875;
	c = (c << 14) ^ c;

	seed ^= a;
	seed ^= 0x6F40ACB6;
	seed ^= b;
	seed ^= 0xFB588AB8;
	seed ^= c;

	return seed;
};

function noise3D(seed, x, y, z) {
	return table[Math.abs(seed3D(seed, x, y, z) % tableSize)];
}

function interpolatedNoise3D(seed, x, y, z) {
	const ix = Math.floor(x);
	const fx = x - ix;
	const iy = Math.floor(y);
	const fy = y - iy;
	const iz = Math.floor(z);
	const fz = z - iz;

	const v000 = noise3D(seed, ix, iy, iz);
	const v100 = noise3D(seed, ix + 1, iy, iz);
	const v010 = noise3D(seed, ix, iy + 1, iz);
	const v110 = noise3D(seed, ix + 1, iy + 1, iz);
	const v001 = noise3D(seed, ix, iy, iz + 1);
	const v101 = noise3D(seed, ix + 1, iy, iz + 1);
	const v011 = noise3D(seed, ix, iy + 1, iz + 1);
	const v111 = noise3D(seed, ix + 1, iy + 1, iz + 1);

	const ix0 = interpolateLinear(v000, v100, fx);
	const ix1 = interpolateLinear(v010, v110, fx);
	const ix2 = interpolateLinear(v001, v101, fx);
	const ix3 = interpolateLinear(v011, v111, fx);

	const iy0 = interpolateLinear(ix0, ix1, fy);
	const iy1 = interpolateLinear(ix2, ix3, fy);

	return interpolateLinear(iy0, iy1, fz);
}

function perlinNoise3D(seed, iterations, scale, x, y, z) {
	let maxValue = 0;
	let factor = 1;
	let ret = 0;

	for(let i = 0; i < iterations; ++i) {
		ret += factor * interpolatedNoise3D(seed, x / scale, y / scale, z / scale);
		maxValue += factor;
		factor /= 1.75;
		scale /= 2;
	}


	return (1 + ret / maxValue) / 2;
}
module.exports = perlinNoise3D;
