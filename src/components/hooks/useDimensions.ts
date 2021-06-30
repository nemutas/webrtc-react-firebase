import { useEffect, useState } from 'react';

const defaultDimensions = { width: 0, height: 0 };

export const useDimensions = (targetRef: React.MutableRefObject<null>) => {
	let [dimensions, setDimensions] = useState(defaultDimensions);
	const node = targetRef.current;
	const updateDimensions = (node: any) => {
		return node
			? {
					width: node.offsetWidth,
					height: node.offsetHeight
			  }
			: defaultDimensions;
	};
	dimensions = updateDimensions(node);

	useEffect(() => {
		const resizeDimensions = () => {
			setDimensions(updateDimensions(node));
		};
		window.removeEventListener('resize', resizeDimensions);
		window.addEventListener('resize', resizeDimensions);
	}, [node]);

	return dimensions;
};
