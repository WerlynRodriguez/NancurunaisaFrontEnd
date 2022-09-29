import { Select } from "antd";

export const AnamAStrings = [
    "Antecedentes Familiares Patológicos",
    "Antecedentes Personales no Patológicos",
    "Antecedentes Personales Patológicos",
    "Historia Laboral"
]

export const AnamBStrings = [
    "Motivo de Consultas",
    "Historia de Enfermedad Actual",
    "Observaciones y Análisis",
    "Diagnástico o Problemas"
]

/* Antecedentes Familiares Patológicos */
export const AFPStrings = [
    "Alergias",
    "Diábetes",
    "Hipertensión Arterial",
    "Enfermedades Renales",
    "Enfermedades Oculares",
    "Enfermedades Cardíacas",
    "Enfermedades Hepáticas",
    "Enfermedades Congénitas",
    "Desordenes Mentales",
    "Enfermedades Degenerativas del sistema Nervioso",
    "Anomalías de Crecimiento y Desarrollo",
    "Otros"
]

/*Atecedentes Personales no Patologicos */
export const APNPStrings =[
    "Horas de sueño",
    "Tabaco",
    "Alcohol",
    "Drogas Ilegales",
    "Farmacos",
    "Otros hábitos"
]

export const APPStrings=[
    "Enfermedades Infecto-Contagiosas",
    "Enfermedades Crónicas",
    "Cirujias Realizadas"
]

export const AFP = [
    <Select.Option key={0} value={0}>{AFPStrings[0]}</Select.Option>,
    <Select.Option key={1} value={1}>{AFPStrings[1]}</Select.Option>,
    <Select.Option key={2} value={2}>{AFPStrings[2]}</Select.Option>,
    <Select.Option key={3} value={3}>{AFPStrings[3]}</Select.Option>,
    <Select.Option key={4} value={4}>{AFPStrings[4]}</Select.Option>,
    <Select.Option key={5} value={5}>{AFPStrings[5]}</Select.Option>,
    <Select.Option key={6} value={6}>{AFPStrings[6]}</Select.Option>,
    <Select.Option key={7} value={7}>{AFPStrings[7]}</Select.Option>,
    <Select.Option key={8} value={8}>{AFPStrings[8]}</Select.Option>,
    <Select.Option key={9} value={9}>{AFPStrings[9]}</Select.Option>,
    <Select.Option key={10} value={10}>{AFPStrings[10]}</Select.Option>,
    <Select.Option key={11} value={11}>{AFPStrings[11]}</Select.Option>
]

export const APNP = [
    <Select.Option key={0} value={0}>{APNPStrings[0]}</Select.Option>,
    <Select.Option key={1} value={1}>{APNPStrings[1]}</Select.Option>,
    <Select.Option key={2} value={2}>{APNPStrings[2]}</Select.Option>,
    <Select.Option key={3} value={3}>{APNPStrings[3]}</Select.Option>,
    <Select.Option key={4} value={4}>{APNPStrings[4]}</Select.Option>,
    <Select.Option key={5} value={5}>{APNPStrings[5]}</Select.Option>
]

export const APP = [
    <Select.Option key={0} value={0}>{APPStrings[0]}</Select.Option>,
    <Select.Option key={1} value={1}>{APPStrings[1]}</Select.Option>,
    <Select.Option key={2} value={2}>{APPStrings[2]}</Select.Option>
]