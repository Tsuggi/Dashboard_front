// script setup
<script setup>
import { ref, onMounted, watch } from 'vue';
import { SommeTonnagesAllMois, filtrerParDct, filtrerParFlux } from '@/utils/fonctionTonnages';

// --- Références réactives ---
const data2023 = ref(null);
const data2024 = ref(null);
const loading = ref(true);
const chartData = ref();
const chartOptions = ref();

// --- DCT ---
const dctSelected = ref([{ name: 'Belz' }, { name: 'Carnac' }, { name: 'Crach' }, { name: 'Quiberon' }, { name: 'Pluvigner' }, { name: 'Saint-Anne' }]);
const optionsDct = ref([...dctSelected.value]);
const resetDct = () => (dctSelected.value = []);

// --- FLUX ---
const fluxSelected = ref([
    { flux: 'Non valorisable' },
    { flux: 'Valorisation energétique' },
    { flux: 'Déchets verts' },
    { flux: 'Gravats' },
    { flux: 'Bois' },
    { flux: 'Carton' },
    { flux: 'Métaux' },
    { flux: 'Mobilier en mélange' },
    { flux: 'Bois PMCB' },
    { flux: 'Plâtre' },
    { flux: 'DEEE' },
    { flux: 'EcoDDS' },
    { flux: 'Plastiques PMCB' },
    { flux: 'Menuiseries vitrées' },
    { flux: 'Articles de Sport et Loisirs' },
    { flux: 'Piles' },
    { flux: 'Néons' },
    { flux: 'Lampes' },
    { flux: 'Briques plâtrières' },
    { flux: 'Huiles minérales' },
    { flux: 'DDS' },
    { flux: 'Pneus' },
    { flux: 'Batteries' },
    { flux: 'Cartouches' },
    { flux: 'Pneus Aliapur' }
]);
const resetFlux = () => (fluxSelected.value = []);

const optionsFluxMajor = ref(['Non valorisable', 'Valorisation energétique', 'Déchets verts', 'Gravats', 'Bois', 'Carton', 'Métaux'].map((f) => ({ flux: f })));

const optionsFluxRep = ref(['Mobilier en mélange', 'Bois PMCB', 'Plâtre', 'DEEE', 'EcoDDS', 'Plastiques PMCB', 'Menuiseries vitrées', 'Articles de Sport et Loisirs', 'Piles', 'Néons', 'Lampes'].map((f) => ({ flux: f })));

const optionsFluxMineurs = ref(['Briques plâtrières', 'Huiles minérales', 'DDS', 'Pneus', 'Batteries', 'Cartouches', 'Pneus Aliapur'].map((f) => ({ flux: f })));

// --- Watch réactif sur DCT et flux ---
watch(
    () => ({ dct: dctSelected.value, flux: fluxSelected.value }),
    ({ dct, flux }) => {
        const nomsDct = dct.map((item) => item.name);
        const nomsFlux = flux.map((item) => item.flux);

        const filtre2023 = filtrerParFlux(filtrerParDct(data2023.value, nomsDct), nomsFlux);
        const filtre2024 = filtrerParFlux(filtrerParDct(data2024.value, nomsDct), nomsFlux);

        chartData.value.datasets[0].data = SommeTonnagesAllMois(filtre2023);
        chartData.value.datasets[1].data = SommeTonnagesAllMois(filtre2024);
    }
);

// --- Récupération des données ---
onMounted(async () => {
    try {
        const [res2024, res2023] = await Promise.all([fetch('http://127.0.0.1:8000/tonnages/2024'), fetch('http://127.0.0.1:8000/tonnages/2023')]);
        data2024.value = await res2024.json();
        data2023.value = await res2023.json();

        chartData.value = setChartData();
        chartOptions.value = setChartOptions();
    } catch (e) {
        console.error('Erreur lors du chargement des données', e);
    } finally {
        loading.value = true;
    }
});

// --- Configuration du graphique ---
const setChartData = () => {
    const style = getComputedStyle(document.documentElement);
    return {
        labels: ['Janv', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
        datasets: [
            {
                label: 'Tonnages 2023',
                data: SommeTonnagesAllMois(data2023.value),
                fill: false,
                borderColor: style.getPropertyValue('--p-red-500'),
                tension: 0.4
            },
            {
                label: 'Tonnages 2024',
                data: SommeTonnagesAllMois(data2024.value),
                fill: false,
                borderColor: style.getPropertyValue('--p-cyan-500'),
                tension: 0.4
            }
        ]
    };
};

const setChartOptions = () => {
    const style = getComputedStyle(document.documentElement);
    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: { color: style.getPropertyValue('--p-text-color') }
            }
        },
        scales: {
            x: {
                ticks: { color: style.getPropertyValue('--p-text-muted-color') },
                grid: { color: style.getPropertyValue('--p-content-border-color') }
            },
            y: {
                ticks: { color: style.getPropertyValue('--p-text-muted-color') },
                grid: { color: style.getPropertyValue('--p-content-border-color') }
            }
        }
    };
};
</script>

<template>
    <div class="card space-y-4">
        <div v-if="loading">
          Waiting
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </div>
        <div v-else>
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
        </div>

        <div class="flex flex-wrap flex-col gap-4">
            <div class="flex items-center gap-2">
                <span>Déchèteries :</span>
                <SelectButton v-model="dctSelected" :options="optionsDct" optionLabel="name" multiple />
                <Button icon="pi pi-times" severity="danger" outlined @click="resetDct" />
            </div>

            <div class="flex items-center gap-2">
                <span>Flux principaux :</span>
                <SelectButton v-model="fluxSelected" :options="optionsFluxMajor" optionLabel="flux" multiple />
                <Button icon="pi pi-times" severity="danger" outlined @click="resetFlux" />
            </div>

            <div class="flex items-center gap-2">
                <span>REP :</span>
                <SelectButton v-model="fluxSelected" :options="optionsFluxRep" optionLabel="flux" multiple />
            </div>

            <div class="flex items-center gap-2">
                <span>Flux mineurs :</span>
                <SelectButton v-model="fluxSelected" :options="optionsFluxMineurs" optionLabel="flux" multiple />
            </div>
        </div>
    </div>
</template>
