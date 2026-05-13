

export type OneLinerSubmission = {
    id: string; 
    target: "Businesses" | "Consumers" | "Both";
    industry :string;
    name: string;
    explanation: string;
    user: string;
    problem: string;
    result: string;
    unique: string;
}

export type GeneratedOneLiner = {
    id: number;
    response: string;
}

// array of responses from LLM
// generated_response = [{id = 0, response = "asdsada"}, {id = 1, response= "sdfsdf"}, etc]
export type OneLinerResponse = {
    generated_responses: GeneratedOneLiner[];
}

export type OneLinerInteraction = {
    id: string;
    submission: OneLinerSubmission | null;
    response: OneLinerResponse;
}


export type OneLinerHistory = {
    interactions: OneLinerInteraction[];
}

