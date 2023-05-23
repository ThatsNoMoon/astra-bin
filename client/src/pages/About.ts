import { Component, css, html } from "destiny-ui";
import { Heading } from "../components/typography";

export class About extends Component {
	static override styles = css`
		:host {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			padding: 1.5rem;
		}

		#container {
			max-width: 30em;
		}

		#container > div {
			line-height: 1.5;
		}

		#container > ${Heading}:nth-child(1)::part(inner) {
			margin-top: 0.75em;
		}
	`;
	override template = html`
		<div id="container">
			<${Heading} prop:level=${2}>
				About Astra Bin
			</${Heading}>
			<div>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus mattis rhoncus urna neque viverra justo. Varius sit amet mattis vulputate enim. Placerat vestibulum lectus mauris ultrices eros in cursus turpis massa. Sit amet cursus sit amet dictum sit amet. Pellentesque id nibh tortor id aliquet. Nunc id cursus metus aliquam eleifend mi in nulla posuere. Maecenas volutpat blandit aliquam etiam erat velit scelerisque in. Purus semper eget duis at tellus at urna. Augue mauris augue neque gravida in fermentum et sollicitudin. Condimentum vitae sapien pellentesque habitant morbi tristique senectus. Diam maecenas ultricies mi eget mauris pharetra et ultrices neque. Leo vel orci porta non pulvinar neque. A iaculis at erat pellentesque adipiscing commodo elit. Nullam non nisi est sit. Quis eleifend quam adipiscing vitae proin sagittis nisl. Sit amet tellus cras adipiscing enim eu turpis. Dictum sit amet justo donec enim diam vulputate ut. Laoreet sit amet cursus sit amet dictum sit amet justo. Sit amet aliquam id diam maecenas ultricies mi.
			</div>
			<${Heading} prop:level=${3}>
				Inner heading
			</${Heading}>
			<div>
				Egestas erat imperdiet sed euismod nisi porta lorem mollis. Ac odio tempor orci dapibus ultrices in iaculis nunc. Tortor aliquam nulla facilisi cras fermentum. Eget magna fermentum iaculis eu non diam. Odio ut enim blandit volutpat maecenas. Odio eu feugiat pretium nibh ipsum consequat nisl. Adipiscing tristique risus nec feugiat in fermentum. Faucibus in ornare quam viverra. Congue nisi vitae suscipit tellus. Id aliquet risus feugiat in ante metus dictum. Neque volutpat ac tincidunt vitae semper. In eu mi bibendum neque egestas congue.
			</div>
			<${Heading} prop:level=${4}>
				Another level
			</${Heading}>
			<div>
				Tristique senectus et netus et malesuada fames ac. Nec feugiat nisl pretium fusce id velit. Tellus in metus vulputate eu scelerisque felis. Lobortis mattis aliquam faucibus purus in massa tempor nec feugiat. Eget nullam non nisi est sit amet facilisis magna. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. A condimentum vitae sapien pellentesque habitant morbi tristique senectus. Dictum varius duis at consectetur lorem donec massa sapien faucibus. Duis at consectetur lorem donec. In fermentum et sollicitudin ac orci phasellus egestas tellus rutrum. Pharetra pharetra massa massa ultricies mi quis. Eu consequat ac felis donec. Eu ultrices vitae auctor eu augue ut lectus arcu bibendum. Dolor morbi non arcu risus quis varius quam. At in tellus integer feugiat scelerisque varius morbi enim nunc. Netus et malesuada fames ac turpis egestas maecenas pharetra convallis. Et netus et malesuada fames ac turpis egestas integer eget. Odio euismod lacinia at quis risus sed vulputate. Scelerisque purus semper eget duis at tellus at urna condimentum. Lorem ipsum dolor sit amet consectetur.
			</div>
			<${Heading} prop:level=${5}>
				More sections
			</${Heading}>
			<div>
				Amet massa vitae tortor condimentum lacinia quis. Id eu nisl nunc mi. Aliquet bibendum enim facilisis gravida neque convallis a. Risus ultricies tristique nulla aliquet enim tortor. Est ultricies integer quis auctor elit sed vulputate mi. Integer vitae justo eget magna fermentum iaculis eu non. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Ut diam quam nulla porttitor massa id. Porttitor lacus luctus accumsan tortor. Tortor id aliquet lectus proin nibh. Dolor sit amet consectetur adipiscing elit ut aliquam. Aenean et tortor at risus. Sed risus ultricies tristique nulla aliquet. At consectetur lorem donec massa. Amet aliquam id diam maecenas ultricies mi eget. Faucibus et molestie ac feugiat sed. Cras semper auctor neque vitae tempus quam. Amet volutpat consequat mauris nunc congue nisi vitae suscipit. Commodo quis imperdiet massa tincidunt nunc.
			</div>
			<${Heading} prop:level=${6}>
				Really small stuff
			</${Heading}>
			<div>
				Tortor posuere ac ut consequat semper viverra nam libero justo. Vestibulum lectus mauris ultrices eros in. Massa massa ultricies mi quis hendrerit dolor magna eget est. Sociis natoque penatibus et magnis. Imperdiet nulla malesuada pellentesque elit eget gravida. Diam in arcu cursus euismod quis viverra nibh cras. Enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Dictum sit amet justo donec enim diam vulputate ut. Consectetur adipiscing elit ut aliquam. Mauris pellentesque pulvinar pellentesque habitant morbi. Malesuada fames ac turpis egestas. Elit eget gravida cum sociis natoque penatibus et magnis dis. Risus quis varius quam quisque id diam vel. Tellus pellentesque eu tincidunt tortor aliquam.
			</div>
		</div>
	`;
}
