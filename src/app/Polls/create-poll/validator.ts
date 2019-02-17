export function validate(regexp: RegExp, control) {
  let value = control;
  let valid = true;
  if (value === null || value === '') {
    return null;
  } else {
    value = value.replace(/[\r\n]+/g, '\n'); // multiple line breaks to one
    value = value.replace(/\n/g, ','); // line break to comma;
    const email = value.replace(/\s+/g, ','); // multiple spaces to no
    const emails = email.split(',');
    for (let i = 0; i < emails.length; i++) {
      if (!regexp.test(emails[i].replace(/\s/g, ''))) {
        valid = false;
      }
    } }
  return valid;
}
