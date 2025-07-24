<script setup>
import { ref, onMounted, watch } from 'vue';
import { SommeTonnagesAllMois, filtrerParDct, filtrerParFlux } from '@/utils/fonctionTonnages';

// Var pour le graphique
const data2023 = ref(null);
const data2024 = ref(null);
const loading = ref(true);
const chartData = ref();
const chartOptions = ref();

// Sélection des dct
const dctSelected = ref([{ name: 'Belz' }, { name: 'Carnac' }, { name: 'Crach' }, { name: 'Quiberon' }, { name: 'Pluvigner' }, { name: 'Saint-Anne' }]);
const options = ref([{ name: 'Belz' }, { name: 'Carnac' }, { name: 'Crach' }, { name: 'Quiberon' }, { name: 'Pluvigner' }, { name: 'Saint-Anne' }]);
const resetDct = () => dctSelected.value = [];
const resetFlux = () => fluxSelected.value = [];

// Sélection des années
const yearSelected = ref([{ year: '2024' }]);
const optionsYear = ref([{ year: '2023' }, { year: '2024' }]);
// Sélection des flux
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
const optionsFluxMajor = ref([{ flux: 'Non valorisable' }, { flux: 'Valorisation energétique' }, { flux: 'Déchets verts' }, { flux: 'Gravats' }, { flux: 'Bois' }, { flux: 'Carton' }, { flux: 'Métaux' }]);

const optionsFluxRep = ref([
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
    { flux: 'Lampes' }
]);

const optionsFluxMineurs = ref([{ flux: 'Briques plâtrières' }, { flux: 'Huiles minérales' }, { flux: 'DDS' }, { flux: 'Pneus' }, { flux: 'Batteries' }, { flux: 'Cartouches' }, { flux: 'Pneus Aliapur' }]);


watch(
    () => ({ dct: dctSelected.value, flux: fluxSelected.value }),
    (newVal, oldVal) => {
        const tabDctSelected = newVal.dct.map((item) => item.name);
        const tabFluxSelected = newVal.flux.map((item) => item.flux);

        console.log(tabFluxSelected);

        const filtreDct2023 = ref(filtrerParDct(data2023.value, tabDctSelected));
        const filtreDct2024 = ref(filtrerParDct(data2024.value, tabDctSelected));

        const newValueChart2023 = SommeTonnagesAllMois(filtrerParFlux(filtreDct2023.value, tabFluxSelected));
        const newValueChart2024 = SommeTonnagesAllMois(filtrerParFlux(filtreDct2024.value, tabFluxSelected));

        chartData.value.datasets[1].data = newValueChart2024;
        chartData.value.datasets[0].data = newValueChart2023;

        console.log(newValueChart2023);
    }
);

// Récupération des données de l'API
onMounted(async () => {
    try {
        const response2024 = await fetch('http://127.0.0.1:8000/tonnages/2024');
        data2024.value = await response2024.json();
        const response2023 = await fetch('http://127.0.0.1:8000/tonnages/2023');
        data2023.value = await response2023.json();

        // Mise en place du graphique
        chartData.value = setChartData();
        chartOptions.value = setChartOptions();

        //chartData.value.datasets[0].data = SommeTonnagesAllMois(data.value);
    } catch (error) {
        data2023.value = 'Erreur lors du chargement des data 2023';
        data2024.value = 'Erreur lors du chargement des date 2024';
    } finally {
        loading.value = false;
    }
});

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Janv', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
        datasets: [
            {
                label: 'Tonnages 2023',
                data: SommeTonnagesAllMois(data2023.value),
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-red-500'),
                tension: 0.4
            },
            {
                label: 'Tonnages 2024',
                data: SommeTonnagesAllMois(data2024.value),
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                tension: 0.4
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
};
</script>

<template>
    <div class="card space-y-4">
        <!-- <div class="card flex justify-center">
            <SelectButton v-model="yearSelected" :options="optionsYear" optionLabel="year" multiple aria-labelledby="multiple" />
        </div> -->
        <div v-if="loading">Chargement...</div>
        <div v-else>
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
        </div>

        <div class="card flex space-x-2">
            <div class="flex">
                <h5>Déchèteries sélectionnées :</h5>
            </div>
            <SelectButton v-model="dctSelected" :options="options" optionLabel="name" multiple aria-labelledby="multiple" />
            <Button icon="pi pi-times" severity="danger" rounded variant="outlined" aria-label="Cancel" @click="resetDct" />
        </div>
        <div class="card flex space-x-2">
            <div class="flex">
                <h5>Flux principaux :</h5>
            </div>
            <SelectButton v-model="fluxSelected" :options="optionsFluxMajor" optionLabel="flux" multiple aria-labelledby="multiple" />
            <Button icon="pi pi-times" severity="danger" rounded variant="outlined" aria-label="Cancel" @click="resetFlux" />
        </div>
        <div class="card flex space-x-2">
            <div class="flex">
                <h5>REP :</h5>
            </div>
            <SelectButton v-model="fluxSelected" :options="optionsFluxRep" optionLabel="flux" multiple aria-labelledby="multiple" />
        </div>
        <div class="card flex space-x-2">
            <div class="flex">
                <h5>Flux minoritaires :</h5>
            </div>
            <SelectButton v-model="fluxSelected" :options="optionsFluxMineurs" optionLabel="flux" multiple aria-labelledby="multiple" />
        </div>
    </div>
</template>
