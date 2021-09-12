declare const objectToFormData: <T = any>(
  object: T,
  options?: Options,
  existingFormData?: FormData,
  keyPrefix?: string
) => FormData;