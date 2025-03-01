<template>
    <div class="timetable-container">
        <div class="timetable">
            <!-- Cabeçalho com os dias da semana -->
            <div class="header"></div>
            <div v-for="day in days" :key="day" class="header day">{{ day }}</div>

            <!-- Grade de horários -->
            <div v-for="hour in hours" :key="hour" class="hour">{{ hour }}</div>

            <!-- Blocos de aulas -->
            <div v-for="(classItem, index) in classes" :key="index" class="class-block"
                :style="getClassStyle(classItem)" @click="editClass(index)">
                {{ classItem.subject }}
            </div>
        </div>

        <!-- Formulário para adicionar aulas -->
        <div class="form">
            <h3>{{ isEditing ? "Editar Aula" : "Adicionar Aula" }}</h3>
            <input v-model="newClass.subject" placeholder="Nome da matéria" />
            <select v-model="newClass.day">
                <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
            </select>
            <input v-model="newClass.startTime" type="time" />
            <input v-model="newClass.endTime" type="time" />
            <button @click="isEditing ? updateClass() : addClass()">
                {{ isEditing ? "Atualizar" : "Adicionar" }}
            </button>
            <button v-if="isEditing" @click="deleteClass()">Excluir</button>
            <button v-if="isEditing" @click="cancelEdit()">Cancelar</button>
        </div>
    </div>
</template>




<script setup>

import { ref, onMounted, watch } from 'vue';

const API_URL = "http://localhost:3001/classes";

const days = ref(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
const hours = ref(["07:40", "08:30", "09:20", "10:10", "11:00", "11:50", "12:40"]);
const classes = ref([]);

const isEditing = ref(false);
const editingIndex = ref(null);


// Carregar os horários do backend
const loadClasses = async () => {
    try {
        const response = await fetch(API_URL);
        classes.value = await response.json();
    } catch (error) {
        console.error("Erro ao carregar horários:", error);
    }
};

// Salvar os horários no backend
const saveClasses = async () => {
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(classes.value)
        });
    } catch (error) {
        console.error("Erro ao salvar horários:", error);
    }
};

// Carrega os dados ao iniciar
onMounted(loadClasses);

// Salva os dados sempre que houver mudanças
watch(classes, saveClasses, { deep: true });

const newClass = ref({ subject: "", day: "Mon", startTime: "08:30", endTime: "09:20" });



const addClass = () => {
    if (!newClass.value.subject || !newClass.value.startTime || !newClass.value.endTime) {
        alert("Preencha todos os campos!");
        return;
    }
    classes.value.push({ ...newClass.value });
    newClass.value = { subject: "", day: "Mon", startTime: "08:30", endTime: "09:20" };
};

const editClass = (index) => {

    newClass.value = { ...classes.value[index] };
    editingIndex.value = index;
    isEditing.value = true;

}

const updateClass = () => {

    if(editingIndex.value !== null){

        classes.value[editingIndex.value] = { ...newClass.value };
        resetForm();

    }

}

const deleteClass = () => {

    if (editingIndex.value !== null) {
        classes.value.splice(editingIndex.value, 1);
        resetForm();
    }

}


const cancelEdit = () => {
    resetForm();
}

const resetForm = () => {

    newClass.value = {
        subject: "",
        day: "Mon",
        startTime: "08:30",
        endTime: "09:20"
    };

    isEditing.value = false;
    editingIndex.value = null;

}


const getClassStyle = (classItem) => {
    const dayIndex = days.value.indexOf(classItem.day) + 1;
    const startIndex = hours.value.indexOf(classItem.startTime) + 2;
    const endIndex = hours.value.indexOf(classItem.endTime) + 2;
    return { "grid-column": dayIndex + 1, "grid-row-start": startIndex, "grid-row-end": endIndex };
};

</script>





<style scoped>
.timetable-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.timetable {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(7, 50px);
    gap: 2px;
    border: 2px solid black;
    padding: 10px;
    background: white;
    width: 100%;
    max-width: 90%;
}

.header {
    background: #333;
    color: white;
    text-align: center;
    font-weight: bold;
    padding: 5px;
}

.hour {
    background: #eee;
    text-align: center;
    font-weight: bold;
    grid-column: 1;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.class-block {
    background: lightblue;
    border: 1px solid #333;
    text-align: center;
    font-weight: bold;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
