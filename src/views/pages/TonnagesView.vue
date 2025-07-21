<script setup>
import { ref, onMounted, watch } from 'vue';
import { SommeTonnagesAllMois, filtrerParDct, SommeTonnagesParAnneesObj } from '@/utils/fonctionTonnages';

// Var pour le graphique
const data = ref(null);
const loading = ref(true);
const chartData = ref();
const chartOptions = ref();

// Sélection des dct
const dctSelected = ref([{ name: 'Belz' }, { name: 'Carnac' }, { name: 'Crach' }, { name: 'Quiberon' }, { name: 'Pluvigner' }, { name: 'Saint-Anne' }]);
const options = ref([{ name: 'Belz' }, { name: 'Carnac' }, { name: 'Crach' }, { name: 'Quiberon' }, { name: 'Pluvigner' }, { name: 'Saint-Anne' }]);
const resetDct = () => {
    dctSelected.value = [];
};
// Sélection des années
const yearSelected = ref([{ year: '2023' }, { year: '2024' }]);
const optionsYear = ref([{ year: '2023' }, { year: '2024' }]);
// Sélection des flux
const fluxSelected = ref(null);
const optionsFluxMajor = ref([{ flux: 'Valorisation energétique' }, { flux: 'Non valorisable' }, { flux: 'Déchets verts' }, { flux: 'Bois' }, { flux: 'Gravats' }, { flux: 'Carton' }, { flux: 'Métaux' }]);

const optionsFluxRepMajor = ref([{ flux: 'EcoDDS' }, { flux: 'Plâtre' }, { flux: 'Plastiques PMCB' }, { flux: 'Mobilier en mélange' }, { flux: 'Bois PMCB' }, { flux: 'Menuiseries vitrées' }, { flux: 'DEEE' }, { flux: 'Briques plâtrières' }]);
const optionsFluxRepMineur = ref([{ flux: 'Néons' }, { flux: 'Lampes' }, { flux: 'Cartouches' }, { flux: 'Piles' }, { flux: 'Pneus Aliapur' }, { flux: 'Articles de Sport et Loisirs' }]);

const opttionsFluxMineurs = ref([{ flux: 'Huiles minérales' }, { flux: 'DDS' }, { flux: 'Pneus' }, { flux: 'Batteries' }]);

watch(dctSelected, (nouvelleValeur) => {
    const tabDctSelected = ref(nouvelleValeur.map((item) => item.name));
    const newValueChart = SommeTonnagesAllMois(filtrerParDct(data.value, tabDctSelected.value));
    chartData.value.datasets[0].data = newValueChart;
    const labelValue = `Tonnages de tous les flux de ${nouvelleValeur.map((item) => item.name)}`;
    chartData.value.datasets[0].label = labelValue;
});

watch(yearSelected, (nouvelleValeur) => {
    const tabYear = nouvelleValeur.map((o) => parseInt(o.year, 10));
    const newValueChart = SommeTonnagesParAnneesObj(data.value, tabYear);

    const documentStyle = getComputedStyle(document.documentElement);

    chartData.value.datasets.push({
        label: 'Tonnages all flux & all dct',
        data: [80, 59, 80, 50, 56, 55, 40],
        fill: true,
        borderColor: documentStyle.getPropertyValue('--p-red-500'),
        tension: 0.4
    });
});

// Récupération des données de l'API
onMounted(async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/tonnages/');
        data.value = await response.json();

        // Mise en place du graphique
        chartData.value = setChartData();
        chartOptions.value = setChartOptions();

        chartData.value.datasets[0].data = SommeTonnagesAllMois(data.value);
    } catch (error) {
        data.value = 'Erreur lors du chargement';
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
                label: 'Tonnages all flux & all dct',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
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
        <div v-if="loading">Chargement...</div>
        <div v-else>
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
        </div>

        <div class="card flex space-x-2">
            <SelectButton v-model="dctSelected" :options="options" optionLabel="name" multiple aria-labelledby="multiple" />
            <Button icon="pi pi-times" severity="danger" rounded variant="outlined" aria-label="Cancel" @click="resetDct" />
        </div>
        <div class="card flex space-x-2">
            <SelectButton v-model="yearSelected" :options="optionsYear" optionLabel="year" multiple aria-labelledby="multiple" />
        </div>
    </div>

    <div class="card flex">
        <SelectButton v-model="fluxSelected" :options="optionsFluxMajor" optionLabel="flux" multiple aria-labelledby="multiple" />
    </div>

    <div class="card flex">
        <SelectButton v-model="fluxSelected" :options="optionsFluxRepMajor" optionLabel="flux" multiple aria-labelledby="multiple" />
    </div>

    <div class="card flex">
        <SelectButton v-model="fluxSelected" :options="optionsFluxRepMineur" optionLabel="flux" multiple aria-labelledby="multiple" />
    </div>

    <div class="card flex">
        <SelectButton v-model="fluxSelected" :options="opttionsFluxMineurs" optionLabel="flux" multiple aria-labelledby="multiple" />
    </div>
</template>
