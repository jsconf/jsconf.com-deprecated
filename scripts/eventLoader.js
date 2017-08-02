if (window.confEvents) {

  const upcomingEvents = window.confEvents
    .filter(event => event.confStatus.length > 0)
    .sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : 1)
    .map(event => renderEvent(event))
  const upcomingWrapper = document.querySelector('#conf-upcoming')
  upcomingWrapper.innerHTML =  upcomingEvents.join('')

  // Filter and load the JSConf events
  const jsconfEvents = window.confEvents
    .filter(event => event.type === 'jsconf')
    .sort(sort)
    .map(event => renderEvent(event))
  const communityWrapper = document.querySelector('#conf-jsconf')
  communityWrapper.innerHTML =  jsconfEvents.join('')

  // Filter and load the JSConf Family of events
  const familyEvents = window.confEvents
    .filter(event => event.type === 'family')
    .sort((a, b) => {
      let score = 0;
      if (a.confStatus.length < b.confStatus.length) {
        score++;
      } else if (a.confStatus.length > b.confStatus.length) {
        score--;
      } else {
        score = a.name.toUpperCase() > b.name.toUpperCase() ? score + 1 : score - 1;
      }
      return score;
    })
    .map(event => renderEvent(event))
  const familyWrapper = document.querySelector('#conf-family')
  familyWrapper.innerHTML = familyEvents.join('')
}

function sort (a, b) {
  let score = 0;
  if (a.confStatus.length < b.confStatus.length) {
    score++;
  } else if (a.confStatus.length > b.confStatus.length) {
    score--;
  } else {
    score = a.name.toUpperCase() > b.name.toUpperCase() ? score + 1 : score - 1;
  }
  return score;
}

function renderEvent (event) {
  var classes = ['conf'].concat(event.confStatus)
  return `
    <div class="${classes.join(' ')}">
      <a href="${event.url}" rel="me">
        <img src="${event.img.url}" alt="${event.img.alt}" width="200" height="200" />
      </a>
      <p>${event.name}${(event.location) ? `<br />${event.location}` : ''}</p>
    </div>
  `
}
