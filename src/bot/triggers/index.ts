import type { Trigger } from "../types";
import { aiTrigger } from "./ai";
import { todoTrigger } from "./todo";
import { timeTrigger } from "./time";
import { hiTrigger } from "./hi";

// Order matters: first match wins.
export const triggers: Trigger[] = [aiTrigger, todoTrigger, timeTrigger, hiTrigger];
