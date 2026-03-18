export type StoryPhase = {
  id: string;
  start: number;
  end: number;
  title: string;
  text: string;
};

export const STORY_PHASES: StoryPhase[] = [
  {
    id: "origen",
    start: 0,
    end: 0.18,
    title: "Origen",
    text: "Antes de que la marea contara historias, existía ya tu risa, tímida y firme, marcando la ribera de este instante. Deliza suavemente...",
  },
  {
    id: "faro",
    start: 0.18,
    end: 0.38,
    title: "Faro",
    text: "Eres faro en la noche cerrada: una luz que se alza en medio de la oscuridad...",
  },
  {
    id: "hogar",
    start: 0.38,
    end: 0.62,
    title: "Casa",
    text: "Eres casa que guarda secretos suaves: un refugio donde el tiempo se aquieta, donde la calma se siente, donde todo se sostiene, aunque afuera el viento cante historias distintas.",
  },
  {
    id: "esencia",
    start: 0.62,
    end: 0.82,
    title: "Tú",
    text: "Eres tu y decir más no tiene sentido.",
  },
  {
    id: "celebracion",
    start: 0.82,
    end: 1,
    title: "Hoy",
    text: "Hoy las olas aplauden tu tiempo, los faros cantan tu nombre, y la casa entera respira: feliz día de vida, de historias, de todo lo que aún no sabemos que florecerá contigo. ",
  },
];

export const FLOWER_MESSAGES = [
  "Tu risa es contagiosa.",
  "Tus cabellos me enrulan.",
  "Felicidades, mi amor.",
  "Tu mirada me encanta.",
  "Elijo estar contigo.",
];

