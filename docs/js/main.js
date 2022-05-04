const SERVICES = [
	{
		name: 'JAMF',
		statusWebsite: 'https://status.jamf.com/',
		statusURL: ['https://status.jamf.com/api/v2/status.json'],
		type: 'description',
	},
	{
		name: 'ASANA',
		statusWebsite: 'https://status.asana.com/',
		statusURL: ['https://status.asana.com/api/v2/status.json'],
		type: 'description',
	},
	{
		name: 'Okta',
		statusWebsite: 'https://trust.okta.com',
		statusURL: ['https://trust.okta.com/api/status'],
		type: 'data',
	},
	{
		name: 'Google Workspace',
		statusWebsite: 'https://www.google.com/appsstatus/dashboard/',
		statusURL: ['https://www.google.com/appsstatus/dashboard/'],
		type: 'google-table',
	},
	{
		name: 'Guru',
		statusWebsite: 'https://status.getguru.com/',
		statusURL: ['https://status.getguru.com/api/v2/status.json'],
		type: 'description',
	},
	{
		name: 'Zoom',
		statusWebsite: 'https://status.zoom.us/',
		statusURL: ['https://status.zoom.us/api/v2/status.json'],
		type: 'description',
	},
	{
		name: 'Slack',
		statusWebsite: 'https://status.slack.com/',
		statusURL: ['https://status.slack.com/api/v2.0.0/current'],
		type: 'status',
	},
	{
		name: '1Password',
		statusWebsite: 'https://1password.statuspage.io/',
		statusURL: ['https://1password.statuspage.io/api/v2/status.json'],
		type: 'description',
	},
	{
		name: 'Splunk',
		statusWebsite: 'https://status.us0.signalfx.com/',
		statusURL: ['https://status.us0.signalfx.com/api/v2/status.json'],
		type: 'description',
	},
	{
		name: 'Zendesk Services',
		statusWebsite: 'https://status.zendesk.com/',
		statusURL: ['https://status.zendesk.com/api/components/services?domain=support.zendesk.com'],
		type: 'status',
	},
	{
		name: 'Zendesk Support',
		statusWebsite: 'https://status.zendesk.com/',
		statusURL: ['https://status.zendesk.com/api/components/support?domain=support.zendesk.com'],
		type: 'status',
	},
	{
		name: 'Zendesk Chat',
		statusWebsite: 'https://status.zendesk.com/',
		statusURL: ['https://status.zendesk.com/api/components/chat?domain=support.zendesk.com'],
		type: 'status',
	},
	{
		name: 'Zendesk Explore',
		statusWebsite: 'https://status.zendesk.com/',
		statusURL: ['https://status.zendesk.com/api/components/explore?domain=support.zendesk.com'],
		type: 'status',
	},
	{
		name: 'Zendesk Sell',
		statusWebsite: 'https://status.zendesk.com/',
		statusURL: ['https://status.zendesk.com/api/components/sell?domain=support.zendesk.com'],
		type: 'status',
	},
	{
		name: 'Zendesk Sunshine',
		statusWebsite: 'https://status.zendesk.com/',
		statusURL: ['https://status.zendesk.com/api/components/sunshine?domain=support.zendesk.com'],
		type: 'status',
	},
]


const body = document.body
const servicesContainer = body.querySelector('.services')
const proxyUrl = 'https://api.allorigins.win/raw?url='

SERVICES.forEach(async (service) => {
	const serviceItem = document.createElement('div')
	serviceItem.classList.add('service')
	servicesContainer.appendChild(serviceItem)
	if (service.type === 'description' || service.type === 'status' || service.type === 'data') {
		serviceItem.innerHTML = `
			<h3 class="service__title">
				${service.name}
			</h3>
			<a href="${service.statusWebsite}" target="_blank" class="service__status service__status--loading">Status loading...</a>
		`
		await fetch(proxyUrl + service.statusURL)
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				if (service.type === 'description') {
					serviceItem.innerHTML = `
						<h3 class="service__title">
							${service.name}
						</h3>
						<a href="${service.statusWebsite}" target="_blank" class="service__status service__status--okay">${data.status.description}</a>
					`
				}
				if (service.type === 'status') {
					serviceItem.innerHTML = `
						<h3 class="service__title">
							${service.name}
						</h3>
						<a href="${service.statusWebsite}" target="_blank" class="service__status service__status--okay">${data.status.toString()}</a>
					`
				}
				if (service.type === 'data') {
					serviceItem.innerHTML = `
						<h3 class="service__title">
							${service.name}
						</h3>
						<a href="${service.statusWebsite}" target="_blank" class="service__status service__status--okay">${data.data.status.toString()}</a>
					`
				}
			})
			.catch(err => {
				console.error(err)
				serviceItem.innerHTML = `
					<h3 class="service__title">
						${service.name}
					</h3>
					<a href="${service.statusWebsite}" target="_blank" class="service__status service__status--error">Getting status error...</a>
				`
			})
	} else if (service.type === 'google-table') {
		const stringToHTML = (string) => {
			const parser = new DOMParser()
			const document = parser.parseFromString(string, 'text/html')
			return document.body
		}
		const makeHttpObject = () => {
			if ("XMLHttpRequest" in window) return new XMLHttpRequest()
			else if ("ActiveXObject" in window) return new ActiveXObject("Msxml2.XMLHTTP")
		}
		const request = makeHttpObject()
		request.open("GET", proxyUrl + service.statusURL, true)
		request.send(null)
		request.onreadystatechange = () => {
			if (request.readyState == 4) {
				const statusElementResponse = request.responseText
				serviceItem.innerHTML = `
					<h3 class="service__title">
						${service.name}
					</h3>
					<a href="${service.statusWebsite}" target="_blank" class="service__status service__status--okay">Open Google Workspace website</a>
					<div class="service__table">
						${stringToHTML(statusElementResponse).querySelector('table').outerHTML}
					</div>
				`
			}
		}
	}
})