import { REQUIRED, TemplateInput } from '@augurproject/artifacts';
import { formatBytes32String } from 'ethers/utils';

export const fillInString = (str: string, inputs: TemplateInput[], values) => {
  return inputs.reduce((acc, input) => {
    const value = values[input.id];
    return acc.replace(`[${input.id}]`, `${value}`);
  }, str);
};

export const fillInQuestion = (template, values) => {
  return fillInString(template.question, template.inputs, values);
}

export const getLongDescription = template => {
  return template.resolutionRules[REQUIRED].map(m => m.text).join('\n');
};

export const getFilledInputs = (template, values) => {
  return values.map((value, index) => ({
    id: template.inputs[index].id,
    type: template.inputs[index].type,
    value,
    timestamp: !isNaN(value) ? value : null,
  }));
};

export const getOutcomes = (template, values) =>
  template.inputs
    .filter(input => input.type.match(/_OUTCOME$/) !== null)
    .map(input => fillInString(input.placeholder, template.inputs, values))
    .map(formatBytes32String);

export const buildExtraInfo = (template, inputValues, categories = []) => ({
  categories,
  description: fillInQuestion(template, inputValues),
  tags: [],
  longDescription: getLongDescription(template),
  template: {
    hash: template.hash,
    question: template.question,
    inputs: getFilledInputs(template, inputValues),
  },
});

export const buildTemplateMarketCreationObject = (
  template,
  inputValues,
  categories = []
) => ({
  outcomes: getOutcomes(template, inputValues),
  extraInfo: JSON.stringify(buildExtraInfo(template, inputValues, categories)),
});
