import React, { Suspense } from 'react'
import { useInView } from 'react-intersection-observer'
import { CircularProgress } from '@material-ui/core';

const LazyLoadOnView: React.FunctionComponent<IProps> = (props) => {
  let { LoadingIndicator = DefaultLoadingIndicator } = props;

  const [ref, inView] = useInView({
    triggerOnce: true,
    // rootMargin: '200px 0px',
    rootMargin: '-70px 0px',
  })

  return (
    <div
      ref={ref}
      // style={{
      //   position: 'relative',
      //   backgroundColor: 'blue',
      // }}
    >
      <Suspense fallback={LoadingIndicator}>
        {inView ? props.children : null}
      </Suspense>
    </div>
  )
}

interface IProps {
  LoadingIndicator?: React.Component,
}

export const DefaultLoadingIndicator = () => (
  <div>
    <CircularProgress/>
  </div>
);


export default LazyLoadOnView;