<script setup>
import { ref, onMounted } from "vue";

const rainContainer = ref(null);
const symbols = "01";
const maxDrops = 100;

onMounted(() => {
	if (!rainContainer.value) return;
	for (let i = 0; i < maxDrops; i++) {
		const span = document.createElement("span");
		span.style.left = Math.random() * 100 + "vw";
		span.style.top = Math.random() * 100 + "vh";
		span.style.setProperty("--speed", Math.random());
		span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
		rainContainer.value.appendChild(span);
	}
});
</script>

<template>
	<div class="text-container">ar://aomineaether</div>
	<div class="rain" ref="rainContainer"></div>
</template>

<style>
body {
	margin: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #000;
	color: #0f0;
	font-family: "Courier New", Courier, monospace;
	font-size: 3rem;
	text-shadow: 0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0;
	overflow: hidden;
	position: relative;
	padding: 0 20px;
}

@keyframes matrixRain {
	0% {
		opacity: 0;
		transform: translateY(-100%);
	}
	50% {
		opacity: 1;
	}
	100% {
		opacity: 0;
		transform: translateY(100%);
	}
}

.rain {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	overflow: hidden;
}

.rain span {
	position: absolute;
	color: #0f0;
	font-size: 1.5rem;
	font-family: "Courier New", Courier, monospace;
	animation: matrixRain linear infinite;
	animation-duration: calc(2s + 2s * var(--speed));
	opacity: 0;
}

/* JavaScript-generated raindrops */
.rain span {
	animation-delay: calc(-2s * var(--speed));
}

.text-container {
	position: relative;
	z-index: 1;
	background-color: rgba(0, 0, 0, 0.8);
	padding: 20px 40px;
	font-size: 3rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
	body {
		font-size: 2rem; /* Smaller font size for mobile */
		padding: 0 10px;
	}

	.text-container {
		font-size: 2rem; /* Adjust text size */
		padding: 15px 30px;
	}

	.rain span {
		font-size: 1.2rem; /* Adjust raindrop size */
	}
}

@media (max-width: 480px) {
	body {
		font-size: 1.5rem; /* Further reduce font size for smaller screens */
	}

	.text-container {
		font-size: 1.5rem;
		padding: 10px 20px;
	}

	.rain span {
		font-size: 1rem; /* Adjust raindrop size */
	}
}
</style>
